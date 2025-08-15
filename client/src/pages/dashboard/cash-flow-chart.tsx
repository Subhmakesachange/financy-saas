import * as React from "react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
  cashFlow: {
    label: "Cash Flow",
    color: "var(--color-chart-3)",
  },
} satisfies ChartConfig;

const CashFlowChart: React.FC<PropsType> = (props) => {
  const { dateRange } = props;
  
  const { data: analyticsData, isFetching } = useChartAnalyticsQuery({
    preset: dateRange?.value,
  });

  // Calculate cash flow (income - expenses) for each period
  const cashFlowData = React.useMemo(() => {
    const chartData = analyticsData?.data?.chartData || [];
    return chartData.map((item) => ({
      month: format(new Date(item.date), "MMM"),
      cashFlow: item.income - item.expenses, // Can be negative
    }));
  }, [analyticsData?.data?.chartData]);

  const totalCashFlow = React.useMemo(() => {
    return cashFlowData.reduce((sum, item) => sum + item.cashFlow, 0);
  }, [cashFlowData]);

  const averageCashFlow = React.useMemo(() => {
    return cashFlowData.length > 0 ? totalCashFlow / cashFlowData.length : 0;
  }, [totalCashFlow, cashFlowData.length]);

  if (isFetching) {
    return <CashFlowChartSkeleton />;
  }

  if (!cashFlowData || cashFlowData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Cash Flow Trend</CardTitle>
          <CardDescription>Monitor your monthly cash flow</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No cash flow data available"
            description="Start tracking your transactions to see your cash flow trend."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Cash Flow Trend</CardTitle>
          <CardDescription>
            Monthly net cash flow over the last 8 months
          </CardDescription>
        </div>
        <div className="flex flex-col justify-center gap-1 px-6 py-4 text-left even:pl-8 sm:border-l sm:border-border sm:pl-8 sm:py-6">
          <span className="text-xs text-muted-foreground">
            Average Cash Flow
          </span>
          <span className="text-lg font-bold leading-none sm:text-3xl">
            {formatCurrency(averageCashFlow)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={cashFlowData}
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
            <Line
              dataKey="cashFlow"
              type="monotone"
              stroke="var(--color-chart-3)"
              strokeWidth={3}
              dot={{
                fill: "var(--color-chart-3)",
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const CashFlowChartSkeleton = () => {
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

export default CashFlowChart;
