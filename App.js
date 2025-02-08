import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Switch, Button, TextInput, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [items, setItems] = useState([]);
  const [packedHistory, setPackedHistory] = useState([]);
  const [weightLimit, setWeightLimit] = useState(50);
  const [newItemName, setNewItemName] = useState("");

  useEffect(() => {
    loadPackedHistory();
  }, []);

  const loadPackedHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem("packedHistory");
      if (storedHistory) {
        setPackedHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Error loading history", error);
    }
  };

  const savePackedHistory = async (history) => {
    try {
      await AsyncStorage.setItem("packedHistory", JSON.stringify(history));
    } catch (error) {
      console.error("Error saving history", error);
    }
  };

  const togglePacked = (id) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, packed: !item.packed } : item
    );
    setItems(updatedItems);

    const packedItems = updatedItems.filter((item) => item.packed);
    setPackedHistory(packedItems);
    savePackedHistory(packedItems);
  };

  const updateWeight = (id, weight) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, weight: parseFloat(weight) || 0, inputWeight: weight } : item
    );
    setItems(updatedItems);
  };

  const resetChecklist = () => {
    setItems([]);
    setPackedHistory([]);
    savePackedHistory([]);
  };

  const addItem = () => {
    if (newItemName) {
      const newItem = {
        id: Date.now(),
        name: newItemName,
        weight: 0,
        packed: false,
        inputWeight: "0",
      };
      setItems([...items, newItem]);
      setNewItemName("");
    }
  };

  const removeItem = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
  };

  const totalWeight = items.reduce((sum, item) => (item.packed ? sum + item.weight : sum), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Travel Checklist</Text>
      <Text style={styles.subtitle}>Assignment 1</Text>

      <View style={styles.weightLimitContainer}>
        <Text style={styles.label}>Set Weight Limit (lb):</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={weightLimit.toString()}
            onChangeText={(text) => setWeightLimit(parseFloat(text) || "")}
          />
        </View>
      </View>

      <TextInput
        style={styles.newinput}
        placeholder="Enter Item Name"
        value={newItemName}
        onChangeText={setNewItemName}
      />
      <Button title="Add Item" onPress={addItem} />

      <ScrollView style={styles.scrollContainer}>
        {items.map((item) => (
          <View key={item.id} style={styles.item}>
            <Text>{item.name}</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={item.inputWeight}
              onChangeText={(text) => updateWeight(item.id, text)}
            />
            <Switch value={item.packed} onValueChange={() => togglePacked(item.id)} />
            <Button title="Remove" onPress={() => removeItem(item.id)} />
          </View>
        ))}
      </ScrollView>

      <Text style={styles.totalWeight}>Total Packed Weight: {totalWeight.toFixed(2)} lb</Text>
      {totalWeight > weightLimit && <Text style={styles.warning}>⚠️ OVERWEIGHT LIMIT! ⚠️</Text>}

      <Button title="Reset Checklist" onPress={resetChecklist} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ededed",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: -15,
    marginBottom: 20,
  },
  weightLimitContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  inputBox: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    width: 100,
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 5,
  },
  input: {
    width: 60,
    borderColor: "gray",
    backgroundColor: "#ededed",
    borderRadius: 5,
    paddingHorizontal: 5,
    textAlign: "center",
    marginLeft: "auto",
    marginRight: 10,
  },
  newinput: {
    backgroundColor: "#ffffff",
    textAlign: "center",
  },
  totalWeight: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  warning: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});
