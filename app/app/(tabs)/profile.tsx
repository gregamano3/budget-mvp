/**
 * Profile & Settings Screen
 */

import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SQLite from "expo-sqlite";
import { useAuthStore } from "../../store/useAuthStore";
import { Colors, Typography, Spacing, BorderRadius, Elevation } from "../../constants/theme";

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const handleClearData = async () => {
    Alert.alert(
      "Clear Offline Data",
      "This will permanently delete all local inventory, receipts, and budget data. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All Data",
          style: "destructive",
          onPress: async () => {
            try {
              const db = await SQLite.openDatabaseAsync("smartinventory.db");
              await db.execAsync(`
                DROP TABLE IF EXISTS receipt_items;
                DROP TABLE IF EXISTS receipts;
                DROP TABLE IF EXISTS inventory_items;
                DROP TABLE IF EXISTS budget_categories;
                DROP TABLE IF EXISTS savings_goals;
              `);
              Alert.alert("Data Cleared", "Restart the app to re-seed the demo data.");
            } catch (e) {
              Alert.alert("Error", "Could not clear data.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
      </View>

      <View style={styles.content}>
        {/* Profile Card */}
        <View style={styles.card}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.fullName || "Demo User"}</Text>
          <Text style={styles.userEmail}>{user?.email || "offline@demo.com"}</Text>
          <View style={styles.offlineBadge}>
            <MaterialIcons name="cloud-off" size={14} color={Colors.primary} />
            <Text style={styles.offlineBadgeText}>Offline Mode</Text>
          </View>
        </View>

        {/* Settings List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.listItem}>
            <MaterialIcons name="person-outline" size={24} color={Colors.onSurfaceVariant} />
            <Text style={styles.listItemText}>Edit Profile</Text>
            <MaterialIcons name="chevron-right" size={24} color={Colors.outline} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <MaterialIcons name="notifications-none" size={24} color={Colors.onSurfaceVariant} />
            <Text style={styles.listItemText}>Notifications</Text>
            <MaterialIcons name="chevron-right" size={24} color={Colors.outline} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <TouchableOpacity style={styles.listItem} onPress={handleClearData}>
            <MaterialIcons name="delete-outline" size={24} color={Colors.error} />
            <Text style={[styles.listItemText, { color: Colors.error }]}>Clear Offline Data</Text>
            <MaterialIcons name="chevron-right" size={24} color={Colors.outline} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant + "40",
  },
  headerTitle: { ...Typography.headlineSm, color: Colors.onSurface },
  content: { padding: Spacing.lg },
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: "center",
    ...Elevation.level1,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "40",
    marginBottom: Spacing.xl,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
    ...Elevation.level2,
  },
  avatarLargeText: { ...Typography.displayMd, color: Colors.onPrimary },
  userName: { ...Typography.headlineSm, color: Colors.onSurface },
  userEmail: { ...Typography.bodyMd, color: Colors.onSurfaceVariant, marginTop: 4 },
  offlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
    gap: 4,
  },
  offlineBadgeText: { ...Typography.labelSm, color: Colors.primary },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { ...Typography.labelMd, color: Colors.outline, textTransform: "uppercase", marginBottom: Spacing.sm, paddingHorizontal: Spacing.sm },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant + "30",
  },
  listItemText: { flex: 1, ...Typography.bodyLg, color: Colors.onSurface, marginLeft: Spacing.md },
  logoutButton: {
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: BorderRadius.md,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButtonText: { ...Typography.labelMd, color: Colors.error, fontSize: 16 },
});
