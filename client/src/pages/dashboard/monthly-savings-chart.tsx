import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import { useChartAnalyticsQuery } from "@/features/analytics/analyticsAPI";
import { format } from "date-fns";

interface PropsType {
  dateRange?: DateRangeType;
}

const chartConfig = {
  savings: {
    label: "Monthly Savings",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

const MonthlySavingsChart: React.FC<PropsType> = (props) => {
  const { dateRange } = props;
  
  const { data: analyticsData, isFetching } = useChartAnalyticsQuery({
    preset: dateRange?.value,
  });
  
  // Calculate savings (income - expenses) for each period
  const savingsData = React.useMemo(() => {
    const chartData = analyticsData?.data?.chartData || [];
    return chartData.map((item) => ({
      month: format(new Date(item.date), "MMM"),
      savings: Math.max(0, item.income - item.expenses), // Ensure savings is not negative
    }));
  }, [analyticsData?.data?.chartData]);

  const totalSavings = React.useMemo(() => {
    return savingsData.reduce((sum, item) => sum + item.savings, 0);
  }, [savingsData]);

  const averageSavings = React.useMemo(() => {
    return savingsData.length > 0 ? totalSavings / savingsData.length : 0;
  }, [totalSavings, savingsData.length]);

  if (isFetching) {
    return <SavingsChartSkeleton />;
  }

  if (!savingsData || savingsData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Monthly Savings Trend</CardTitle>
          <CardDescription>Track your monthly savings progress</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No savings data available"
            description="Start tracking your income and expenses to see your savings trend."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Monthly Savings Trend</CardTitle>
          <CardDescription>
            Showing your savings for the last 8 months
          </CardDescription>
        </div>
        <div className="flex flex-col justify-center gap-1 px-6 py-4 text-left even:pl-8 sm:border-l sm:border-border sm:pl-8 sm:py-6">
          <span className="text-xs text-muted-foreground">
            Average Monthly Savings
          </span>
          <span className="text-lg font-bold leading-none sm:text-3xl">
            {formatCurrency(averageSavings)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={savingsData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="savings"
              fill="var(--color-chart-2)"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const SavingsChartSkeleton = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[280px] w-full" />
      </CardContent>
    </Card>
  );
};

export default MonthlySavingsChart;
