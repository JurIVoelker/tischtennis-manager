import Typography from "./typography";

interface HeadlineProps {
  children?: React.ReactNode;
}

const Headline: React.FC<HeadlineProps> = ({ children }) => {
  return (
    <Typography variant="h2" className="mb-12 text-center md:text-left">
      {children}
    </Typography>
  );
};

export default Headline;
