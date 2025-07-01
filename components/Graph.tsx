import React from "react";
import { Dimensions, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useTheme } from "../contexts/ThemeContext";
import { timestampTrackerService } from "../services/TimestampTrackerService";
import { HourlyStats } from "../types";

interface GraphProps {
  data: HourlyStats[];
}

const Graph: React.FC<GraphProps> = ({ data }) => {
  const screenWidth = Dimensions.get("window").width;
  const { colors } = useTheme();

  if (data.length === 0) {
    return (
      <View className="p-4">
        <Text className="text-center" style={{ color: colors.textSecondary }}>
          No data available
        </Text>
      </View>
    );
  }

  const chartData = {
    labels: data.map(
      (item) => timestampTrackerService.formatHour(item.hour).split(" ")[0]
    ),
    datasets: [
      {
        data: data.map((item) => item.count),
      },
    ],
  };

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 180, 0, ${opacity})`,
    labelColor: (opacity = 1) => {
      // Convert hex to rgba
      const hex = colors.textSecondary.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    },
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: colors.accent,
    },
    barPercentage: 0.6,
  };

  return (
    <View>
      <BarChart
        data={chartData}
        width={screenWidth - 80}
        height={180}
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        showValuesOnTopOfBars={true}
        fromZero={true}
        yAxisLabel=""
        yAxisSuffix=""
      />
    </View>
  );
};

export default Graph;
