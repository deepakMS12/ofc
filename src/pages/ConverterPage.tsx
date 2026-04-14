import { Stack } from "@mui/material";
import Converter from "./Converter";
import { converterSections } from "../data/converterSections";

const ConverterPage = () => {
  return (
    <Stack spacing={5}>
      {converterSections.map((section) => (
        <Converter
          key={section.id}
          title={section.title}
          converters={section.converters}
        />
      ))}
    </Stack>
  );
};

export default ConverterPage;
