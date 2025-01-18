import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import vector icons
import { useRoute } from '@react-navigation/native';

const TodoScreen = () => {
  const route = useRoute();
  const userId = route.params?.userId; // Get userId from route parameters
  console.log('User ID:', userId);

  const [todos, setTodos] = useState([]); //this is flatlist state
  const [newTodo, setNewTodo] = useState('');//this is textinput state

  useEffect(() => {
    fetchTodos(); 
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`https://todo-backend-ten-umber.vercel.app/api/todo/todos/${userId}`);
      const data = await response.json();
      console.log(data)

      if (response.ok) {
        setTodos(data); // Set todos in state
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong while fetching tasks');
    }
  };

  // Add new task
  const handleAddTodo = async () => {
    if (!newTodo) {
      Alert.alert('Error', 'Please enter a task');
      return;
    }

    try {
      const response = await fetch('https://todo-backend-ten-umber.vercel.app/api/todo/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          title: newTodo,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewTodo(''); // Clear input field
        fetchTodos(); // Fetch all todos after adding new task
        Alert.alert('Success', 'Task added successfully!');
      } else {
        Alert.alert('Error', data.message || 'Failed to add task');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };


  // Delete task
  const handleDeleteTodo = async (_id) => {
    try {
      const response = await fetch(`https://todo-backend-ten-umber.vercel.app/api/todo/todos/${_id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== _id));
        Alert.alert('Success', 'Task deleted successfully!');
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>To-Do List</Text>

      {/* Input and Add Task button in one row */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter new task"
          value={newTodo}
          onChangeText={setNewTodo}
        />
        <Button title="add" onPress={handleAddTodo} />
      </View>

      {/* List of tasks */}
      {todos.length===0 && (<Text style={{color:'grey',textAlign:'center'}}>add your Task</Text>)}
      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text style={styles.todoText}>{item.title}</Text>
            <View style={styles.iconContainer}>
              {/* Delete Icon */}
              <TouchableOpacity onPress={() => handleDeleteTodo(item._id)}>
                <Icon name="delete" size={24} color="red" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 10, // Space between input and button
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  todoText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 15,
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default TodoScreen;
