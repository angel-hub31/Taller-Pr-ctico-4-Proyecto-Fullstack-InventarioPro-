import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import ProductosScreen from './src/screens/ProductosScreen';
import NuevoProductoScreen from './src/screens/NuevoProductoScreen';
import DetallesScreen from './src/screens/DetallesScreen';
import EditarProductoScreen from './src/screens/EditarProductoScreen';

import { ProductoProvider } from './src/context/ProductoContext';

export type RootStackParamList = {
  MainTabs: undefined;
  Detalles: { producto: any };
  Editar: { producto: any };
};

export type RootTabParamList = {
  Listado: undefined;
  Nuevo: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#10b981' }}>
      <Tab.Screen
        name="Listado"
        component={ProductosScreen}
        options={{
          title: 'Mis Productos',
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Nuevo"
        component={NuevoProductoScreen}
        options={{
          title: 'Nuevo producto',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ProductoProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Detalles" component={DetallesScreen} />
          <Stack.Screen name="Editar" component={EditarProductoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ProductoProvider>
  );
}