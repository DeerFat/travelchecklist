import React, {useState, useEffect} from "react";
import {View, Text, ScrollView, Switch, Button, StyleSheet} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const itemsList = [
  { id: 1, name: "list 1" },
  { id: 2, name: "list 2" },
  { id: 3, name: "list 3" },
  { id: 4, name: "list 4" },
  { id: 5, name: "list 5" },
];

export default function App() {
  const [items, setItems] = useState(
    itemsList.map((item) => ({ ...item, packed: false }))
  );
  const [packedHistory, setPackedHistory] = useState([]);

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

  const resetChecklist = () => {
    setItems(itemsList.map((item) => ({ ...item, packed: false })));
    setPackedHistory([]);
    savePackedHistory([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Assignent 1</Text>

      <ScrollView style={styles.scrollContainer}>
        {items.map((item) => (
          <View key={item.id} style={styles.item}>
            <Text>{item.name}</Text>
            <Switch value={item.packed} onValueChange={() => togglePacked(item.id)} />
          </View>
        ))}
      </ScrollView>

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
    marginBottom: 20,
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
  },
});
