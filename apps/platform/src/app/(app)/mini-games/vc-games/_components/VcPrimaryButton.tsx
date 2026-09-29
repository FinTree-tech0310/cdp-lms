import { forwardRef, type ComponentPropsWithoutRef } from "react";

import { BorderBeam } from "@/components/ui/border-beam";

import styles from "./vc-primary-button.module.css";

interface VcPrimaryButtonProps extends ComponentPropsWithoutRef<"button"> {
  beam?: boolean;
  beamColor?: string;
  spacing?: "default" | "roomy";
}

export const VcPrimaryButton = forwardRef<HTMLButtonElement, VcPrimaryButtonProps>(
  function VcPrimaryButton(
    {
      beam = false,
      beamColor = "#fff5e8",
      children,
      className = "",
      spacing = "default",
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        className={`${styles.button} ${beam ? styles.beamed : ""} ${spacing === "roomy" ? styles.roomy : ""} ${className}`}
        {...props}
      >
        {beam ? (
          <BorderBeam
            aria-hidden="true"
            borderWidth={2}
            duration={3.6}
            lightColor={beamColor}
            lightWidth={84}
          />
        ) : null}
        <span className={styles.label}>{children}</span>
      </button>
    );
  },
);
