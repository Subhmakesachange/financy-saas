import { motion } from "framer-motion"
import { StatCard } from "@/components/ui/stat-card"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard,
  PiggyBank,
  Target
} from "lucide-react"

const statsData = [
  {
    title: "Total Balance",
    value: "$12,345.67",
    description: "Current account balance",
    icon: <DollarSign size={24} />,
    gradient: "purple" as const,
  },
  {
    title: "Monthly Income",
    value: "$4,200.00",
    description: "This month's earnings",
    icon: <TrendingUp size={24} />,
    gradient: "green" as const,
  },
  {
    title: "Monthly Expenses",
    value: "$2,850.30",
    description: "This month's spending",
    icon: <TrendingDown size={24} />,
    gradient: "orange" as const,
  },
  {
    title: "Credit Cards",
    value: "$1,250.50",
    description: "Outstanding balance",
    icon: <CreditCard size={24} />,
    gradient: "blue" as const,
  },
  {
    title: "Savings Goal",
    value: "75%",
    description: "Progress to target",
    icon: <Target size={24} />,
    gradient: "pink" as const,
  },
  {
    title: "Investments",
    value: "$8,750.25",
    description: "Portfolio value",
    icon: <PiggyBank size={24} />,
    gradient: "purple" as const,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
}

export function DashboardStats() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Financial Overview
        </h2>
        <p className="text-muted-foreground">
          Track your financial progress with these key metrics
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
      >
        {statsData.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <StatCard
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
              gradient={stat.gradient}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
