// @ts-expect-error bun is not relevant on prod
import { $ } from "bun"
import { resolve } from "path";

(async () => {

  // await $`docker stop ttm-postgres`.quiet().catch(() => { })
  // await $`docker rm ttm-postgres`.quiet().catch(() => { })

  const stdout = (await $`docker ps -a`.quiet()).text()
  // @ts-expect-error bun is not relevant on prod
  const dbContainer = stdout.split("\n").find(line => line.includes("ttm-postgres"));

  const filePath = resolve(import.meta.dir, "../backup.dmp")
  const backupFile = Bun.file(filePath)

  if (!dbContainer) {
    console.log("Creating new Postgres container...")
    await $`docker run -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=devdb -p 5432:5432 --name ttm-postgres -d postgres`
    await new Promise((resolve) => setTimeout(resolve, 3000));
    if (await backupFile.exists()) {
      console.log("Copying backup file to container")
      await $`docker cp ${filePath} ttm-postgres:/backup.dmp`
      console.log("Restoring database from backup")
      await $`docker exec -i ttm-postgres pg_restore -U postgres -d devdb /backup.dmp`
    }
  } else {
    console.log("Starting existing Postgres container...")
    await $`docker start ttm-postgres`.quiet()
  }

  console.log("Finished setting up the Database.")
})();
