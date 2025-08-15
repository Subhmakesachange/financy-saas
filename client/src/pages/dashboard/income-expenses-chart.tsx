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
  ChartLegend,
  ChartLegendContent,
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
  income: {
    label: "Income",
    color: "var(--color-chart-1)",
  },
  expenses: {
    label: "Expenses",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

const IncomeExpensesChart: React.FC<PropsType> = (props) => {
  const { dateRange } = props;
  
  const { data: analyticsData, isFetching } = useChartAnalyticsQuery({
    preset: dateRange?.value,
  });

  // Format the data for the comparison chart
  const comparisonData = React.useMemo(() => {
    const chartData = analyticsData?.data?.chartData || [];
    return chartData.map((item) => ({
      month: format(new Date(item.date), "MMM"),
      income: item.income,
      expenses: item.expenses,
    }));
  }, [analyticsData?.data?.chartData]);

  const totals = React.useMemo(() => {
    return comparisonData.reduce(
      (acc, item) => ({
        totalIncome: acc.totalIncome + item.income,
        totalExpenses: acc.totalExpenses + item.expenses,
      }),
      { totalIncome: 0, totalExpenses: 0 }
    );
  }, [comparisonData]);

  const netProfit = totals.totalIncome - totals.totalExpenses;

  if (isFetching) {
    return <IncomeExpensesChartSkeleton />;
  }

  if (!comparisonData || comparisonData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Income vs Expenses</CardTitle>
          <CardDescription>Compare your monthly income and expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No comparison data available"
            description="Start tracking your income and expenses to see the comparison."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Income vs Expenses</CardTitle>
          <CardDescription>
            Monthly comparison for the last 8 months
          </CardDescription>
        </div>
        <div className="flex flex-col justify-center gap-1 px-6 py-4 text-left even:pl-8 sm:border-l sm:border-border sm:pl-8 sm:py-6">
          <span className="text-xs text-muted-foreground">
            Net Profit
          </span>
          <span className={`text-lg font-bold leading-none sm:text-3xl ${
            netProfit >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatCurrency(netProfit)}
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
            data={comparisonData}
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="income"
              fill="var(--color-chart-1)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="expenses"
              fill="var(--color-chart-2)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const IncomeExpensesChartSkeleton = () => {
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

export default IncomeExpensesChart;
