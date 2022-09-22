import { Typography, ToggleButtonGroup, ToggleButton } from "@mui/material";
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
    <ToggleButtonGroup
      size="small"
      color="secondary"
      value={selectedPeriodIndex}
      onChange={(_, newValue: number) => onSelectPeriod(newValue)}
      exclusive
      fullWidth
    >
      {periods.map((period, index) => (
        <ToggleButton key={index} value={index}>
          <Typography
            variant="caption"
            fontSize={{ xs: "0.7em", sm: "0.8em", md: "default" }}
          >
            {period.label}
          </Typography>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default PeriodPicker;
