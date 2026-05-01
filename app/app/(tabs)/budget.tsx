/**
 * Budgeting System Screen — Matches the budgeting_system design mockup.
 * Offline-first: loads categories and savings goals from SQLite.
 */

import { useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/useAuthStore";
import { useBudgetStore, BudgetCategory } from "../../store/useBudgetStore";
import { Colors, Typography, Spacing, BorderRadius, Elevation } from "../../constants/theme";
import Svg, { Circle } from "react-native-svg";

export default function BudgetScreen() {
  const user = useAuthStore((s) => s.user);
  const { categories, goals, isLoading, loadBudget, getTotalBudget, getTotalSpent } = useBudgetStore();

  useEffect(() => {
    loadBudget();
  }, []);

  const onRefresh = useCallback(async () => {
    await loadBudget();
  }, [loadBudget]);

  const totalBudget = getTotalBudget();
  const totalSpent = getTotalSpent();
  const budgetPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const renderDonutChart = () => {
    const size = 160;
    const strokeWidth = 24;
    const center = size / 2;
    const radius = center - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    let currentOffset = 0;

    return (
      <View style={styles.chartContainer}>
        <Svg width={size} height={size}>
          {/* Background circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={Colors.surfaceContainer}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Slices */}
          {categories.map((cat, index) => {
            const percentage = totalSpent > 0 ? cat.spent / totalSpent : 0;
            const strokeDasharray = `${circumference * percentage} ${circumference}`;
            const strokeDashoffset = -currentOffset;
            currentOffset += circumference * percentage;

            return (
              <Circle
                key={cat.id}
                cx={center}
                cy={center}
                r={radius}
                stroke={cat.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="butt"
                fill="none"
                rotation="-90"
                origin={`${center}, ${center}`}
              />
            );
          })}
        </Svg>
        <View style={styles.chartCenterText}>
          <Text style={styles.chartCenterLabel}>TOTAL</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </View>
          <Text style={styles.headerTitle}>SmartInventory</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialIcons name="notifications-none" size={24} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Monthly Spending Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>MONTHLY SPENDING</Text>
            <View style={styles.monthChip}>
              <Text style={styles.monthChipText}>October 2023</Text>
            </View>
          </View>
          <Text style={styles.totalSpentText}>
            ${totalSpent.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </Text>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(budgetPercentage, 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {budgetPercentage.toFixed(0)}% of total budget utilized
          </Text>
        </View>

        {/* Spending by Category */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Spending by Category</Text>
          <View style={styles.categoryRow}>
            {renderDonutChart()}
            <View style={styles.legendContainer}>
              {categories.slice(0, 3).map((cat) => {
                const pct = totalSpent > 0 ? (cat.spent / totalSpent) * 100 : 0;
                return (
                  <View key={cat.id} style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: cat.color }]} />
                    <Text style={styles.legendLabel} numberOfLines={1}>{cat.name}</Text>
                    <Text style={styles.legendValue}>{pct.toFixed(0)}%</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Alerts Row */}
        <View style={styles.alertRow}>
          <View style={styles.alertCard}>
            <MaterialIcons name="warning-amber" size={24} color={Colors.primary} />
            <Text style={styles.alertLabel}>BUDGET LIMITS</Text>
            <Text style={styles.alertValue}>2 Critical</Text>
            <Text style={styles.alertSubtextError}>Supplies +12%</Text>
          </View>
          <View style={styles.savingsCard}>
            <MaterialIcons name="trending-up" size={24} color={Colors.onPrimary} />
            <Text style={styles.savingsLabel}>SAVINGS TRACKING</Text>
            <Text style={styles.savingsValue}>+$2.4k</Text>
            <Text style={styles.savingsSubtext}>Goal: 85% reached</Text>
          </View>
        </View>

        {/* Budget Limits List */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Budget Limits</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {categories.slice(3).map((cat) => {
          const isOverLimit = cat.spent > cat.budget_limit;
          const pct = Math.min((cat.spent / cat.budget_limit) * 100, 100);
          return (
            <View key={cat.id} style={styles.limitCard}>
              <View style={styles.limitIconContainer}>
                <MaterialIcons
                  name={cat.name.includes("Shipping") ? "local-shipping" : "inventory"}
                  size={24}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.limitInfo}>
                <Text style={styles.limitName}>{cat.name}</Text>
                <Text style={styles.limitMeta}>Limit: ${cat.budget_limit.toLocaleString()}</Text>
              </View>
              <View style={styles.limitRight}>
                <Text style={styles.limitSpent}>${cat.spent.toLocaleString()}</Text>
                <Text style={[styles.limitPct, { color: isOverLimit ? Colors.error : Colors.success }]}>
                  {isOverLimit ? "Over limit" : `${pct.toFixed(0)}% used`}
                </Text>
              </View>
            </View>
          );
        })}

        {/* Savings Goals */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing.md, marginBottom: Spacing.sm }]}>
          Savings Goals
        </Text>
        {goals.map((goal) => {
          const pct = Math.min((goal.current / goal.target) * 100, 100);
          return (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View>
                  <Text style={styles.goalName}>{goal.name}</Text>
                  <Text style={styles.goalMeta}>
                    Target: ${goal.target.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </Text>
                </View>
                <Text style={styles.goalCurrent}>
                  ${goal.current.toLocaleString()}
                </Text>
              </View>
              <View style={styles.goalBarBg}>
                <View style={[styles.goalBarFill, { width: `${pct}%` }]} />
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.marginMobile,
    paddingVertical: Spacing.sm,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { ...Typography.labelMd, color: Colors.onPrimary, fontSize: 14 },
  headerTitle: { ...Typography.headlineSm, color: Colors.onSurface },
  notificationButton: { padding: Spacing.sm },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.marginMobile, paddingBottom: 100 },
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Elevation.level1,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "40",
    marginBottom: Spacing.md,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: Spacing.sm },
  cardLabel: { ...Typography.labelMd, color: Colors.onSurfaceVariant, letterSpacing: 1 },
  monthChip: { backgroundColor: Colors.surfaceContainerHigh, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  monthChipText: { ...Typography.labelMd, color: Colors.primary },
  totalSpentText: { ...Typography.displayMd, color: Colors.primary, marginBottom: Spacing.md },
  progressBarBg: { height: 8, backgroundColor: Colors.surfaceContainerHighest, borderRadius: 4, marginBottom: Spacing.xs, overflow: "hidden" },
  progressBarFill: { height: "100%", backgroundColor: Colors.primary, borderRadius: 4 },
  progressText: { ...Typography.labelSm, color: Colors.onSurfaceVariant },
  sectionTitle: { ...Typography.headlineSm, color: Colors.onSurface, marginBottom: Spacing.md },
  categoryRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  chartContainer: { width: 160, height: 160, justifyContent: "center", alignItems: "center" },
  chartCenterText: { position: "absolute", justifyContent: "center", alignItems: "center" },
  chartCenterLabel: { ...Typography.labelMd, color: Colors.outline, letterSpacing: 2 },
  legendContainer: { flex: 1, marginLeft: Spacing.lg, gap: Spacing.sm },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendColor: { width: 12, height: 12, borderRadius: 2, marginRight: Spacing.sm },
  legendLabel: { ...Typography.bodyMd, color: Colors.onSurface, flex: 1 },
  legendValue: { ...Typography.bodyMd, color: Colors.onSurfaceVariant },
  alertRow: { flexDirection: "row", gap: Spacing.md, marginBottom: Spacing.md },
  alertCard: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Elevation.level1,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "40",
  },
  alertLabel: { ...Typography.labelSm, color: Colors.onSurfaceVariant, letterSpacing: 1, marginTop: Spacing.sm },
  alertValue: { ...Typography.headlineSm, color: Colors.onSurface, marginTop: 4 },
  alertSubtextError: { ...Typography.labelSm, color: Colors.error, marginTop: 4 },
  savingsCard: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Elevation.level2,
  },
  savingsLabel: { ...Typography.labelSm, color: "rgba(255,255,255,0.8)", letterSpacing: 1, marginTop: Spacing.sm },
  savingsValue: { ...Typography.headlineSm, color: Colors.onPrimary, marginTop: 4 },
  savingsSubtext: { ...Typography.labelSm, color: "rgba(255,255,255,0.9)", marginTop: 4 },
  sectionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: Spacing.sm, marginTop: Spacing.sm },
  viewAllText: { ...Typography.labelMd, color: Colors.primary },
  limitCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Elevation.level1,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "40",
  },
  limitIconContainer: { width: 40, height: 40, borderRadius: 8, backgroundColor: Colors.surfaceContainerHigh, justifyContent: "center", alignItems: "center", marginRight: Spacing.md },
  limitInfo: { flex: 1 },
  limitName: { ...Typography.bodyLg, color: Colors.onSurface, fontWeight: "500" },
  limitMeta: { ...Typography.labelSm, color: Colors.onSurfaceVariant, marginTop: 2 },
  limitRight: { alignItems: "flex-end" },
  limitSpent: { ...Typography.bodyLg, color: Colors.onSurface, fontWeight: "600" },
  limitPct: { ...Typography.labelSm, marginTop: 2 },
  goalCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  goalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: Spacing.md },
  goalName: { ...Typography.headlineSm, color: Colors.onSurface },
  goalMeta: { ...Typography.bodyMd, color: Colors.onSurfaceVariant, marginTop: 2 },
  goalCurrent: { ...Typography.displayMd, color: Colors.primary },
  goalBarBg: { height: 8, backgroundColor: Colors.surfaceContainerHighest, borderRadius: 4, overflow: "hidden" },
  goalBarFill: { height: "100%", backgroundColor: Colors.primary, borderRadius: 4 },
});
