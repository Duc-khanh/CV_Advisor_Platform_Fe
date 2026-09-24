import { IconButton, Tooltip } from "@mui/material";

/**
 * Icon button dùng chung: luôn có accessible label và tooltip nhất quán.
 */
export default function AppIconButton({
  label,
  icon,
  tooltip = label,
  disabled = false,
  size = "small",
  sx,
  ...buttonProps
}) {
  const button = (
    <IconButton
      aria-label={label}
      disabled={disabled}
      size={size}
      sx={sx}
      {...buttonProps}
    >
      {icon}
    </IconButton>
  );

  if (!tooltip) return button;

  return (
    <Tooltip title={tooltip} arrow>
      <span>{button}</span>
    </Tooltip>
  );
}
