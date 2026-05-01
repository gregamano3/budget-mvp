/**
 * Inventory Management Screen — matches the inventory_management design mockup.
 * Offline-first: all data from local SQLite.
 */

import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/useAuthStore";
import { useInventoryStore, InventoryItem } from "../../store/useInventoryStore";
import { Colors, Typography, Spacing, BorderRadius, Elevation } from "../../constants/theme";

export default function InventoryScreen() {
  const user = useAuthStore((s) => s.user);
  const {
    items,
    categories,
    activeFilter,
    searchQuery,
    isLoading,
    setFilter,
    setSearch,
    loadItems,
    removeItem,
    getFilteredItems,
    getTotalValuation,
    getLowStockCount,
  } = useInventoryStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  }, []);

  const filteredItems = getFilteredItems();
  const totalValuation = getTotalValuation();
  const lowStockCount = getLowStockCount();

  const handleDelete = (item: InventoryItem) => {
    Alert.alert("Delete Item", `Remove "${item.name}" from inventory?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => removeItem(item.id),
      },
    ]);
  };

  const renderItem = ({ item }: { item: InventoryItem }) => {
    const isLowStock = item.quantity <= 5;
    return (
      <View style={[styles.itemCard, isLowStock && styles.itemCardLowStock]}>
        {/* Product Image Placeholder */}
        <View style={styles.itemImage}>
          <MaterialIcons
            name={
              item.category === "Electronics"
                ? "devices"
                : item.category === "Groceries"
                ? "local-grocery-store"
                : "home"
            }
            size={28}
            color={Colors.outline}
          />
        </View>

        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.chipContainer}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>{item.category}</Text>
            </View>
          </View>
          <View style={styles.stockRow}>
            <MaterialIcons
              name="inventory"
              size={14}
              color={isLowStock ? Colors.error : Colors.secondary}
            />
            <Text
              style={[
                styles.stockText,
                { color: isLowStock ? Colors.error : Colors.secondary },
              ]}
            >
              {isLowStock
                ? `${String(item.quantity).padStart(2, "0")} left`
                : `${item.quantity} in stock`}
            </Text>
            <Text style={styles.priceText}>
              ${item.price.toFixed(2)}
              {item.category === "Groceries" ? "/ea" : ""}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => handleDelete(item)}
        >
          <MaterialIcons name="more-vert" size={22} color={Colors.outline} />
        </TouchableOpacity>
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

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        ListHeaderComponent={
          <>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <MaterialIcons name="search" size={22} color={Colors.outline} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search inventory items..."
                placeholderTextColor={Colors.outline}
                value={searchQuery}
                onChangeText={setSearch}
              />
            </View>

            {/* Filter Chips */}
            <FlatList
              horizontal
              data={categories}
              keyExtractor={(c) => c}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
              renderItem={({ item: cat }) => (
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    activeFilter === cat && styles.filterChipActive,
                  ]}
                  onPress={() => setFilter(cat)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      activeFilter === cat && styles.filterChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              )}
            />

            {/* Summary Cards */}
            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Total Valuation</Text>
                <Text style={styles.summaryValue}>
                  ${totalValuation.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </Text>
                <View style={styles.summaryBar}>
                  <View style={[styles.summaryBarFill, { width: "72%", backgroundColor: Colors.primary }]} />
                </View>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Low Stock Items</Text>
                <Text style={[styles.summaryValue, { color: Colors.error }]}>{lowStockCount}</Text>
                <View style={styles.warningRow}>
                  <MaterialIcons name="warning" size={12} color={Colors.error} />
                  <Text style={styles.warningText}>Needs Attention</Text>
                </View>
              </View>
            </View>

            {/* Active Shipments Banner */}
            <View style={styles.shipmentBanner}>
              <View>
                <Text style={styles.shipmentLabel}>Active Shipments</Text>
                <Text style={styles.shipmentCount}>04</Text>
              </View>
              <MaterialIcons name="local-shipping" size={40} color="rgba(255,255,255,0.3)" />
            </View>

            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Inventory Dashboard</Text>
              <TouchableOpacity style={styles.sortButton}>
                <MaterialIcons name="sort" size={18} color={Colors.primary} />
                <Text style={styles.sortText}>Sort</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="inventory-2" size={48} color={Colors.outlineVariant} />
            <Text style={styles.emptyText}>No items found</Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <MaterialIcons name="add" size={28} color={Colors.onPrimary} />
      </TouchableOpacity>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { ...Typography.labelMd, color: Colors.onPrimary, fontSize: 16 },
  headerTitle: { ...Typography.headlineSm, color: Colors.onSurface },
  notificationButton: { padding: Spacing.sm },
  listContent: { paddingHorizontal: Spacing.marginMobile, paddingBottom: 100 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "60",
    paddingHorizontal: Spacing.md,
    height: 48,
    marginBottom: Spacing.md,
  },
  searchInput: { flex: 1, marginLeft: Spacing.sm, ...Typography.bodyMd, color: Colors.onSurface },
  chipRow: { gap: Spacing.sm, marginBottom: Spacing.md, paddingRight: Spacing.md },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainer,
  },
  filterChipActive: { backgroundColor: Colors.onSurface },
  filterChipText: { ...Typography.labelMd, color: Colors.onSurfaceVariant },
  filterChipTextActive: { color: Colors.surfaceContainerLowest },
  summaryRow: { flexDirection: "row", gap: Spacing.md, marginBottom: Spacing.md },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Elevation.level1,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "30",
  },
  summaryLabel: { ...Typography.labelSm, color: Colors.onSurfaceVariant, textTransform: "uppercase" },
  summaryValue: { ...Typography.numericLg, color: Colors.primary, marginTop: 4 },
  summaryBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.outlineVariant + "30",
    marginTop: Spacing.sm,
    overflow: "hidden",
  },
  summaryBarFill: { height: "100%", borderRadius: 2 },
  warningRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: Spacing.sm },
  warningText: { ...Typography.labelSm, color: Colors.error },
  shipmentBanner: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  shipmentLabel: { ...Typography.labelMd, color: "rgba(255,255,255,0.8)" },
  shipmentCount: { ...Typography.displayLg, color: Colors.onPrimary },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: { ...Typography.headlineSm, color: Colors.onSurface },
  sortButton: { flexDirection: "row", alignItems: "center", gap: 4 },
  sortText: { ...Typography.labelMd, color: Colors.primary },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Elevation.level1,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "30",
  },
  itemCardLowStock: { borderLeftWidth: 3, borderLeftColor: Colors.error },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.default,
    backgroundColor: Colors.surfaceContainerLow,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  itemInfo: { flex: 1 },
  itemName: { ...Typography.bodyLg, color: Colors.onSurface, fontWeight: "600" },
  chipContainer: { flexDirection: "row", marginTop: 4 },
  chip: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  chipText: { ...Typography.labelSm, color: Colors.onSurfaceVariant },
  stockRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  stockText: { ...Typography.labelMd, marginRight: Spacing.sm },
  priceText: { ...Typography.bodyMd, color: Colors.onSurface, fontWeight: "600" },
  menuButton: { padding: Spacing.sm },
  emptyState: { alignItems: "center", paddingTop: 60 },
  emptyText: { ...Typography.bodyMd, color: Colors.outline, marginTop: Spacing.sm },
  fab: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 100 : 80,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...Elevation.level2,
  },
});
