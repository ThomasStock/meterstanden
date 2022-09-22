import { ButtonGroup, Button, Typography } from "@mui/material";
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
    <ButtonGroup variant="contained" size="small" fullWidth>
      {periods.map((period, index) => (
        <Button
          key={index}
          disabled={index === selectedPeriodIndex}
          onClick={() => onSelectPeriod(index)}
        >
          <Typography variant="caption" fontSize="0.8em">
            {period.label}
          </Typography>
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default PeriodPicker;
