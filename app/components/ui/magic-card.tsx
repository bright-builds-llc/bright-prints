import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";
import { useCallback, useEffect, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react";

import { cn } from "~/lib/utils";

interface MagicCardBaseProps {
  children?: ReactNode;
  className?: string;
  gradientFrom?: string;
  gradientSize?: number;
  gradientTo?: string;
}

interface MagicCardGradientProps extends MagicCardBaseProps {
  mode?: "gradient";

  gradientColor?: string;
  gradientOpacity?: number;

  glowAngle?: never;
  glowBlendMode?: never;
  glowBlur?: never;
  glowFrom?: never;
  glowOpacity?: never;
  glowSize?: never;
  glowTo?: never;
}

interface MagicCardOrbProps extends MagicCardBaseProps {
  mode: "orb";

  glowAngle?: number;
  glowBlendMode?: CSSProperties["mixBlendMode"];
  glowBlur?: number;
  glowFrom?: string;
  glowOpacity?: number;
  glowSize?: number;
  glowTo?: string;

  gradientColor?: never;
  gradientOpacity?: never;
}

type MagicCardProps = MagicCardGradientProps | MagicCardOrbProps;
type ResetReason = "enter" | "global" | "init" | "leave";

function isOrbMode(props: MagicCardProps): props is MagicCardOrbProps {
  return props.mode === "orb";
}

export function MagicCard(props: MagicCardProps) {
  const {
    children,
    className,
    gradientColor = "rgba(20, 94, 86, 0.14)",
    gradientFrom = "#8fd9c8",
    gradientOpacity = 0.8,
    gradientSize = 200,
    gradientTo = "#f7f3ec",
    mode = "gradient",
  } = props;

  const glowAngle = isOrbMode(props) ? (props.glowAngle ?? 90) : 90;
  const glowBlendMode = isOrbMode(props)
    ? (props.glowBlendMode ?? "multiply")
    : "multiply";
  const glowBlur = isOrbMode(props) ? (props.glowBlur ?? 60) : 60;
  const glowFrom = isOrbMode(props) ? (props.glowFrom ?? "#ee7f27") : "#ee7f27";
  const glowOpacity = isOrbMode(props) ? (props.glowOpacity ?? 0.9) : 0.9;
  const glowSize = isOrbMode(props) ? (props.glowSize ?? 420) : 420;
  const glowTo = isOrbMode(props) ? (props.glowTo ?? "#176b5f") : "#176b5f";

  const mouseX = useMotionValue(-gradientSize);
  const mouseY = useMotionValue(-gradientSize);

  const orbX = useSpring(mouseX, { damping: 30, mass: 0.6, stiffness: 250 });
  const orbY = useSpring(mouseY, { damping: 30, mass: 0.6, stiffness: 250 });
  const orbVisible = useSpring(0, { damping: 35, stiffness: 300 });

  const glowOpacityRef = useRef(glowOpacity);
  const gradientSizeRef = useRef(gradientSize);
  const modeRef = useRef(mode);

  useEffect(() => {
    glowOpacityRef.current = glowOpacity;
  }, [glowOpacity]);

  useEffect(() => {
    gradientSizeRef.current = gradientSize;
  }, [gradientSize]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const reset = useCallback(
    (reason: ResetReason = "leave") => {
      if (modeRef.current === "orb") {
        orbVisible.set(reason === "enter" ? glowOpacityRef.current : 0);
        return;
      }

      const offscreenOffset = -gradientSizeRef.current;
      mouseX.set(offscreenOffset);
      mouseY.set(offscreenOffset);
    },
    [mouseX, mouseY, orbVisible],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      mouseX.set(event.clientX - rect.left);
      mouseY.set(event.clientY - rect.top);
    },
    [mouseX, mouseY],
  );

  useEffect(() => {
    reset("init");
  }, [reset]);

  useEffect(() => {
    const handleGlobalPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) {
        reset("global");
      }
    };
    const handleBlur = () => reset("global");
    const handleVisibility = () => {
      if (document.visibilityState !== "visible") {
        reset("global");
      }
    };

    window.addEventListener("pointerout", handleGlobalPointerOut);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("pointerout", handleGlobalPointerOut);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [reset]);

  return (
    <motion.div
      className={cn(
        "group relative isolate overflow-hidden rounded-[inherit] border border-transparent",
        className,
      )}
      onPointerEnter={() => reset("enter")}
      onPointerLeave={() => reset("leave")}
      onPointerMove={handlePointerMove}
      style={{
        background: useMotionTemplate`
          linear-gradient(var(--color-background) 0 0) padding-box,
          radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
            ${gradientFrom},
            ${gradientTo},
            var(--color-border) 100%
          ) border-box
        `,
      }}
    >
      <div className="bg-background absolute inset-px z-20 rounded-[inherit]" />

      {mode === "gradient" ? (
        <motion.div
          suppressHydrationWarning
          className="pointer-events-none absolute inset-px z-30 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
                ${gradientColor},
                transparent 100%
              )
            `,
            opacity: gradientOpacity,
          }}
        />
      ) : (
        <motion.div
          suppressHydrationWarning
          aria-hidden="true"
          className="pointer-events-none absolute z-30"
          style={{
            background: `linear-gradient(${glowAngle}deg, ${glowFrom}, ${glowTo})`,
            borderRadius: 9999,
            filter: `blur(${glowBlur}px)`,
            height: glowSize,
            mixBlendMode: glowBlendMode,
            opacity: orbVisible,
            translateX: "-50%",
            translateY: "-50%",
            width: glowSize,
            willChange: "transform, opacity",
            x: orbX,
            y: orbY,
          }}
        />
      )}

      <div className="relative z-40">{children}</div>
    </motion.div>
  );
}
