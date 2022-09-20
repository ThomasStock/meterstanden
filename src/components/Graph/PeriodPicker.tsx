import { ButtonGroup, Button } from "@mui/material";
import { PeriodOptions } from "../../utils/useAppStore";

interface PeriodPickerProps {
  periods?: PeriodOptions[];
  selectedPeriodIndex: number;
  onSelectPeriod: (newPeriodIndex: number) => void;
}

const PeriodPicker = (props: PeriodPickerProps) => {
  const { periods, selectedPeriodIndex, onSelectPeriod } = props;

  if (!periods) {
    return null;
  }

  return (
    <ButtonGroup variant="outlined" className="mt-5">
      {periods.map((period, index) => (
        <Button
          size="small"
          key={index}
          disabled={index === selectedPeriodIndex}
          onClick={() => onSelectPeriod(index)}
        >
          {period.label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default PeriodPicker;
