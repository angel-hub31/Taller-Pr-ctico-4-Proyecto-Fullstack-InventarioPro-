import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function DetallesScreen({ route, navigation }: any) {
    const { producto } = route.params;

    return (
        <SafeAreaView style={styles.mainContainer} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1f2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detalles del Producto</Text>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {producto.fotoBase64 ? (
                    <Image source={{ uri: producto.fotoBase64 }} style={styles.image} />
                ) : (
                    <View style={styles.noImage}>
                        <Text style={styles.noImageText}>Sin Imagen</Text>
                    </View>
                )}

                <View style={styles.card}>
                    <Text style={styles.title}>{producto.nombre}</Text>
                    <Text style={styles.price}>${producto.precio}</Text>
                    <Text style={styles.label}>Categoría: <Text style={styles.value}>{producto.categoria}</Text></Text>
                    <Text style={styles.label}>Código de Barras: <Text style={styles.value}>{producto.codigoBarras || 'No registrado'}</Text></Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#f5f7fa' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff', elevation: 2 },
    backButton: { marginRight: 15 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },
    container: { padding: 20, alignItems: 'center', paddingBottom: 60 },
    image: { width: 200, height: 200, borderRadius: 10, marginBottom: 20 },
    noImage: { width: 200, height: 200, backgroundColor: '#ccc', borderRadius: 10, marginBottom: 20, justifyContent: 'center', alignItems: 'center' },
    noImageText: { color: '#666' },
    card: { width: '100%', backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 3 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
    price: { fontSize: 22, color: '#10b981', fontWeight: 'bold', marginBottom: 15 },
    label: { fontSize: 16, fontWeight: 'bold', color: '#555', marginTop: 10 },
    value: { fontWeight: 'normal', color: '#000' }
});