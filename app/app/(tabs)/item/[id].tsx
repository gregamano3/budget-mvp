/**
 * Add / Edit Inventory Item Screen
 */

import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useInventoryStore } from "../../../store/useInventoryStore";
import { Colors, Typography, Spacing, BorderRadius, Elevation } from "../../../constants/theme";

const CATEGORIES = ["Groceries", "Electronics", "Home", "Uncategorized"];

export default function ItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isEditing = id !== "new";
  
  const { items, addItem, updateItem } = useInventoryStore();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("0.00");
  const [sku, setSku] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing) {
      const item = items.find((i) => i.id === id);
      if (item) {
        setName(item.name);
        setCategory(item.category);
        setQuantity(item.quantity.toString());
        setPrice(item.price.toString());
        setSku(item.sku || "");
        setImageUrl(item.image_url || null);
      }
    }
  }, [id, isEditing, items]);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Missing Info", "Please provide an item name.");
      return;
    }
    
    const parsedQty = parseInt(quantity, 10);
    const parsedPrice = parseFloat(price);

    if (isNaN(parsedQty) || parsedQty < 0) {
      Alert.alert("Invalid Input", "Quantity must be a valid number.");
      return;
    }

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      Alert.alert("Invalid Input", "Price must be a valid number.");
      return;
    }

    try {
      if (isEditing) {
        await updateItem(id as string, {
          name,
          category,
          quantity: parsedQty,
          price: parsedPrice,
          sku: sku || undefined,
          image_url: imageUrl || undefined,
        });
      } else {
        await addItem({
          id: `inv-manual-${Date.now()}`,
          name,
          category,
          quantity: parsedQty,
          price: parsedPrice,
          sku: sku || undefined,
          image_url: imageUrl || undefined,
        });
      }
      router.back();
    } catch (e) {
      Alert.alert("Error", "Failed to save item.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? "Edit Item" : "New Item"}</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Image Picker */}
          <View style={styles.imageSection}>
            <TouchableOpacity style={styles.imageContainer} onPress={handlePickImage}>
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <MaterialIcons name="add-a-photo" size={32} color={Colors.outlineVariant} />
                  <Text style={styles.imageText}>Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ITEM NAME</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Wireless Mouse"
                placeholderTextColor={Colors.outline}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CATEGORY</Text>
              <View style={styles.categoryRow}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[styles.categoryChipText, category === cat && styles.categoryChipTextActive]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: Spacing.sm }]}>
                <Text style={styles.label}>QUANTITY</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={setQuantity}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: Spacing.sm }]}>
                <Text style={styles.label}>PRICE ($)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="decimal-pad"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>SKU / BARCODE</Text>
              <TextInput
                style={styles.input}
                placeholder="Optional"
                placeholderTextColor={Colors.outline}
                value={sku}
                onChangeText={setSku}
                autoCapitalize="characters"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Item</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant + "40",
  },
  backButton: { padding: Spacing.sm },
  headerTitle: { ...Typography.headlineSm, color: Colors.onSurface },
  keyboardView: { flex: 1 },
  scrollContent: { padding: Spacing.lg, paddingBottom: 100 },
  imageSection: { alignItems: "center", marginBottom: Spacing.lg },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "60",
    borderStyle: "dashed",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  imagePlaceholder: { alignItems: "center" },
  imageText: { ...Typography.labelSm, color: Colors.outlineVariant, marginTop: 4 },
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Elevation.level1,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "40",
  },
  inputGroup: { marginBottom: Spacing.lg },
  label: { ...Typography.labelMd, color: Colors.onSurfaceVariant, marginBottom: Spacing.sm },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: BorderRadius.default,
    paddingHorizontal: Spacing.md,
    ...Typography.bodyLg,
    color: Colors.onSurface,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  row: { flexDirection: "row" },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainer,
    borderWidth: 1,
    borderColor: "transparent",
  },
  categoryChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  categoryChipText: { ...Typography.labelMd, color: Colors.onSurfaceVariant },
  categoryChipTextActive: { color: Colors.onPrimary },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant + "40",
    paddingBottom: Platform.OS === "ios" ? 34 : Spacing.lg,
  },
  saveButton: {
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    ...Elevation.level1,
  },
  saveButtonText: { ...Typography.labelMd, color: Colors.onPrimary, fontSize: 16 },
});
