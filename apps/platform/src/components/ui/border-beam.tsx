"use client"

import {
  type CSSProperties,
  type ComponentPropsWithoutRef,
} from "react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

import styles from "./border-beam.module.css"

interface BorderBeamProps extends ComponentPropsWithoutRef<"div"> {
  lightWidth?: number
  duration?: number
  lightColor?: string
  borderWidth?: number
}

type BorderBeamStyle = CSSProperties & {
  "--border-width"?: string
  "--light-color"?: string
  "--light-width"?: string
}

export function BorderBeam({
  lightWidth = 200,
  duration = 10,
  lightColor = "#FAFAFA",
  borderWidth = 1,
  className,
  ...props
}: BorderBeamProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div
      style={
        {
          "--border-width": `${borderWidth}px`,
          "--light-color": lightColor,
          "--light-width": `${lightWidth}px`,
        } as BorderBeamStyle
      }
      className={cn(styles.beam, className)}
      {...props}
    >
      <motion.div
        className={styles.sweep}
        animate={shouldReduceMotion ? undefined : { rotate: 360 }}
        transition={
          shouldReduceMotion
            ? undefined
            : {
                duration,
                repeat: Infinity,
                ease: "linear",
              }
        }
      />
    </div>
  )
}
