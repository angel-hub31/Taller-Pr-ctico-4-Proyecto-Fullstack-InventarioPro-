import React from 'react'; 
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProductos } from '../context/ProductoContext'; 
import { Ionicons } from '@expo/vector-icons'; 

export default function ProductosScreen({ navigation }: any) { 
    const { productos, deleteProducto } = useProductos(); 

    const verDetalles = (producto: any) => { 
        navigation.navigate('Detalles', { producto }); 
    }; 

    const actualizarProducto = (producto: any) => { 
        navigation.navigate('Editar', { producto }); 
    }; 

    const renderItem = ({ item }: any) => ( 
        <View style={styles.card}> 
            {item.fotoBase64 ? ( 
                <Image source={{ uri: item.fotoBase64 }} style={styles.image} /> 
            ) : ( 
                <View style={styles.noImage}> 
                    <Text style={styles.noImageText}>Sin Imagen</Text> 
                </View> 
            )} 

            <View style={styles.info}> 
                <Text style={styles.title}>{item.nombre}</Text> 
                <Text>Categoría: {item.categoria}</Text> 
                <Text style={styles.price}>${item.precio}</Text> 
            </View> 

            <View style={styles.actionContainer}> 
                <TouchableOpacity onPress={() => verDetalles(item)} style={styles.actionBtn}> 
                    <Ionicons name="eye-outline" size={22} color="#3b82f6" /> 
                </TouchableOpacity> 

                <TouchableOpacity onPress={() => actualizarProducto(item)} style={styles.actionBtn}> 
                    <Ionicons name="pencil-outline" size={22} color="#f59e0b" /> 
                </TouchableOpacity> 

                <TouchableOpacity onPress={() => deleteProducto(item.id)} style={styles.actionBtn}> 
                    <Ionicons name="trash-outline" size={22} color="#ef4444" /> 
                </TouchableOpacity> 
            </View> 
        </View> 
    ); 

    return ( 
        <SafeAreaView style={styles.container} edges={['top']}> 
            <FlatList 
                data={productos} 
                keyExtractor={(item) => item.id.toString()} 
                renderItem={renderItem} 
                ListEmptyComponent={<Text style={styles.emptyText}>No hay productos en el inventario.</Text>} 
            /> 
        </SafeAreaView> 
    ); 
} 

const styles = StyleSheet.create({ 
    container: { flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal: 10 }, 
    card: { flexDirection: 'row', backgroundColor: '#fff', marginBottom: 10, borderRadius: 8, padding: 10, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 }, 
    image: { width: 60, height: 60, borderRadius: 8, marginRight: 10 }, 
    noImage: { width: 60, height: 60, backgroundColor: '#ccc', borderRadius: 8, marginRight: 10, justifyContent: 'center', alignItems: 'center' }, 
    noImageText: { fontSize: 10, textAlign: 'center', color: '#333' }, 
    info: { flex: 1 }, 
    title: { fontWeight: 'bold', fontSize: 16 }, 
    price: { color: 'green', fontWeight: 'bold', marginTop: 4 }, 
    actionContainer: { flexDirection: 'row', alignItems: 'center' }, 
    actionBtn: { padding: 6, marginLeft: 4 }, 
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' } 
});