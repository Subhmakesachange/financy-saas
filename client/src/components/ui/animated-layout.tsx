import { motion } from "framer-motion"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface AnimatedLayoutProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function AnimatedLayout({ children, className, delay = 0 }: AnimatedLayoutProps) {
  return (
    <motion.div
      className={cn("min-h-screen", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.43, 0.13, 0.23, 0.96],
      }}
    >
      {children}
    </motion.div>
  )
}

interface FadeInWhenVisibleProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function FadeInWhenVisible({ children, className, delay = 0 }: FadeInWhenVisibleProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            delay,
            ease: [0.43, 0.13, 0.23, 0.96],
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

interface SlideInFromSideProps {
  children: ReactNode
  direction?: "left" | "right"
  className?: string
  delay?: number
}

export function SlideInFromSide({ 
  children, 
  direction = "left", 
  className, 
  delay = 0 
}: SlideInFromSideProps) {
  const initialX = direction === "left" ? -100 : 100

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0, x: initialX },
        visible: {
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.8,
            delay,
            ease: [0.43, 0.13, 0.23, 0.96],
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

interface StaggeredListProps {
  children: ReactNode[]
  className?: string
  staggerDelay?: number
}

export function StaggeredList({ children, className, staggerDelay = 0.1 }: StaggeredListProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                ease: [0.43, 0.13, 0.23, 0.96],
              },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
