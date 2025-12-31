import { orderRomanArray, romanToInt } from "@/lib/romanUtils";
// @ts-expect-error bun not avaliable on prod
import { expect, test } from "bun:test";

const testRoman = (string: string, expected: number) => {
  romanToInt(string);
  expect(romanToInt(string)).toBe(expected);
}

test("Test Roman: I", () => {
  testRoman("I", 1)
});

test("Test Roman: II", () => {
  testRoman("II", 2)
});

test("Test Roman: IV", () => {
  testRoman("IV", 4)
});

test("Test Roman: VI", () => {
  testRoman("VI", 6)
});

test("Test Roman: VII", () => {
  testRoman("VII", 7)
});

test("Test Roman: VIII", () => {
  testRoman("VIII", 8)
});

test("Test Roman: IX", () => {
  testRoman("IX", 9)
});

test("Test Roman: IXQ", () => {
  testRoman("IXQ", 9)
});

test("Test Roman sorting", () => {
  const romanObjects = [{ roman: "X" }, { roman: "V" }, { roman: "IV" }, { roman: "IX" }, { roman: "III" }];
  const sortedArray = orderRomanArray<{ roman: string }>(romanObjects, "roman");
  expect(sortedArray.map(obj => obj.roman)).toEqual(["III", "IV", "V", "IX", "X"]);
})