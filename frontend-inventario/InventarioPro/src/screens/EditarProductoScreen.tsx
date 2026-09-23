import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useProductos } from '../context/ProductoContext';
import { Ionicons } from '@expo/vector-icons';

export default function EditarProductoScreen({ route, navigation }: any) {
    const { producto } = route.params;
    const { updateProducto } = useProductos();

    const [nombre, setNombre] = useState(producto.nombre);
    const [precio, setPrecio] = useState(producto.precio.toString());
    const [categoria, setCategoria] = useState(producto.categoria);
    const [foto, setFoto] = useState<string | null>(producto.fotoBase64);
    const [codigoBarras, setCodigoBarras] = useState(producto.codigoBarras || '');

    const tomarFoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) return Alert.alert('Error', 'Permiso denegado');

        const result = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.5 });
        if (!result.canceled && result.assets[0].base64) {
            setFoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
    };

    const guardarCambios = async () => {
        if (!nombre.trim() || !precio.trim()) {
            return Alert.alert('Error', 'El nombre y el precio son obligatorios');
        }

        const productoEditado: any = {
            nombre,
            precio: parseFloat(precio),
            categoria,
            fotoBase64: foto,
        };

        if (codigoBarras.trim() !== '') {
            productoEditado.codigoBarras = codigoBarras;
        }

        const exito = await updateProducto(producto.id, productoEditado);

        if (exito) {
            Alert.alert('Éxito', 'Producto actualizado correctamente');
            navigation.navigate('MainTabs', { screen: 'Listado' });
        }
    };

    return (
        <SafeAreaView style={styles.mainBackground} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.mainTitle}>Editar Producto</Text>

                <View style={styles.card}>
                    <Text style={styles.label}>NOMBRE</Text>
                    <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />

                    <Text style={styles.label}>PRECIO</Text>
                    <TextInput style={styles.input} value={precio} onChangeText={setPrecio} keyboardType="numeric" />

                    <Text style={styles.label}>CATEGORÍA</Text>
                    <TextInput style={styles.input} value={categoria} onChangeText={setCategoria} />

                    <Text style={styles.label}>CÓDIGO DE BARRAS (Opcional)</Text>
                    <TextInput style={styles.input} value={codigoBarras} onChangeText={setCodigoBarras} />

                    <View style={styles.imagePreviewWrapper}>
                        {foto ? (
                            <Image source={{ uri: foto }} style={styles.previewImage} />
                        ) : (
                            <View style={styles.emptyImage}>
                                <Ionicons name="image-outline" size={40} color="#999" />
                                <Text style={styles.emptyImageText}>Sin imagen</Text>
                            </View>
                        )}
                    </View>

                    <TouchableOpacity style={styles.actionBtn} onPress={tomarFoto}>
                        <Ionicons name="camera" size={24} color="#3b82f6" />
                        <Text style={styles.actionText}>Cambiar foto</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footerRow}>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="close" size={20} color="#ef4444" />
                        <Text style={styles.cancelBtnText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.saveBtn} onPress={guardarCambios}>
                        <Ionicons name="save" size={18} color="#fff" style={{ marginRight: 5 }} />
                        <Text style={styles.saveBtnText}>Actualizar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainBackground: { flex: 1, backgroundColor: '#f5f7fa' },
    scrollContainer: { padding: 20, paddingBottom: 100 },
    mainTitle: { color: '#1f2937', fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
    card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginBottom: 20, elevation: 2 },
    label: { color: '#f59e0b', fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
    input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 12, marginBottom: 18, fontSize: 15 },
    imagePreviewWrapper: { alignItems: 'center', marginVertical: 10 },
    emptyImage: { width: 130, height: 130, backgroundColor: '#f3f4f6', borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', borderStyle: 'dashed' },
    emptyImageText: { color: '#9ca3af', marginTop: 10, fontSize: 14 },
    previewImage: { width: 130, height: 130, borderRadius: 16, resizeMode: 'cover' },
    actionBtn: { alignItems: 'center', padding: 10, marginTop: 10 },
    actionText: { color: '#6b7280', marginTop: 6, fontSize: 13 },
    footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
    cancelBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 0.48, paddingVertical: 14, borderRadius: 10, borderWidth: 1, borderColor: '#ef4444' },
    cancelBtnText: { color: '#ef4444', fontWeight: 'bold', fontSize: 16, marginLeft: 5 },
    saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 0.48, backgroundColor: '#f59e0b', paddingVertical: 14, borderRadius: 10 },
    saveBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 }
});