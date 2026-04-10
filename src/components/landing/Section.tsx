"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

type SectionProps = HTMLMotionProps<"section"> & {
  id?: string;
  className?: string;
};

export function Section({ children, className = "", id, ...props }: SectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}
