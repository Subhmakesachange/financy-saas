import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  className?: string
  gradient?: "purple" | "blue" | "green" | "orange" | "pink"
}

const gradients = {
  purple: "from-purple-500 via-violet-500 to-pink-500",
  blue: "from-blue-500 via-cyan-500 to-teal-500",
  green: "from-green-500 via-emerald-500 to-teal-500",
  orange: "from-orange-500 via-red-500 to-pink-500",
  pink: "from-pink-500 via-rose-500 to-red-500",
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ title, value, description, icon, className, gradient = "purple" }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative w-48 h-64 bg-black/90 backdrop-blur-sm rounded-lg cursor-pointer overflow-hidden group",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Animated background gradient */}
        <motion.div
          className={cn(
            "absolute -inset-1 bg-gradient-to-r opacity-75 rounded-xl blur-sm",
            gradients[gradient]
          )}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Hover effect gradient */}
        <motion.div
          className={cn(
            "absolute inset-0 bg-gradient-to-r opacity-0 rounded-lg",
            gradients[gradient]
          )}
          whileHover={{ opacity: 0.1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Card content */}
        <div className="relative z-10 h-full flex flex-col justify-end p-4 gap-3 bg-black/80 rounded-lg backdrop-blur-sm">
          {/* Icon */}
          {icon && (
            <motion.div
              className="text-white/80 mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              {icon}
            </motion.div>
          )}

          {/* Title */}
          <motion.h3
            className="text-white font-bold text-lg capitalize leading-tight"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {title}
          </motion.h3>

          {/* Description */}
          {description && (
            <motion.p
              className="text-white/70 text-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {description}
            </motion.p>
          )}

          {/* Value */}
          <motion.p
            className={cn(
              "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
              gradients[gradient]
            )}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          >
            {value}
          </motion.p>
        </div>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out"
          initial={{ translateX: "-100%" }}
        />
      </motion.div>
    )
  }
)

StatCard.displayName = "StatCard"

export { StatCard }
export type { StatCardProps }
