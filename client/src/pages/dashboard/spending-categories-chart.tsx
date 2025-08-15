import * as React from "react";
import { Cell, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { EmptyState } from "@/components/empty-state";
import { DateRangeType } from "@/components/date-range-select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format-currency";
import { formatPercentage } from "@/lib/format-percentage";
import { useExpensePieChartBreakdownQuery } from "@/features/analytics/analyticsAPI";

interface PropsType {
  dateRange?: DateRangeType;
}

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)", 
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const chartConfig = {
  amount: {
    label: "Amount",
  },
} satisfies ChartConfig;

const SpendingCategoriesChart: React.FC<PropsType> = (props) => {
  const { dateRange } = props;
  
  const { data: expenseData, isFetching } = useExpensePieChartBreakdownQuery({
    preset: dateRange?.value,
  });

  const totalSpending = expenseData?.data?.totalSpent || 0;

  // Format data for the chart
  const data = React.useMemo(() => {
    const categories = expenseData?.data?.breakdown || [];
    return categories.map((category) => ({
      category: category.name,
      amount: category.value,
      percentage: category.percentage,
    }));
  }, [expenseData?.data?.breakdown]);

  if (isFetching) {
    return <SpendingCategoriesChartSkeleton />;
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Spending by Categories</CardTitle>
          <CardDescription>Breakdown of your spending categories</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No spending data available"
            description="Start adding expenses to see your spending breakdown by categories."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Spending by Categories</CardTitle>
        <CardDescription>Monthly spending breakdown</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[280px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              innerRadius={60}
              outerRadius={120}
              strokeWidth={2}
            >
              {data.map((_, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>Total Spending</span>
            <span>{formatCurrency(totalSpending)}</span>
          </div>
          <div className="space-y-1">
            {data.map((item, index) => (
              <div key={item.category} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-muted-foreground">{item.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{formatCurrency(item.amount)}</span>
                  <span className="text-muted-foreground">
                    ({formatPercentage(item.percentage / 100)})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SpendingCategoriesChartSkeleton = () => {
  return (
    <Card className="w-full">
      <CardHeader className="items-center pb-0">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <Skeleton className="mx-auto aspect-square max-h-[280px] rounded-full" />
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingCategoriesChart;
