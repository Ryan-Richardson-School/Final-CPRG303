import { useRouter } from "expo-router";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ActivityIndicator,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import * as storage from "../../utils/storage";
import { COLORS, SIZES, SHADOW } from "../../constants/theme";
import type { KeyboardTypeOptions } from "react-native";



const profileSchema = z.object({
  firstName: z.string().trim().min(3, "First name must be at least 3 characters"),
  lastName: z.string().trim().min(3, "Last name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  
  phone: z
    .string()
    .refine(
      (val: string) => val.replace(/\D/g, "").length >= 10,
      "Phone number must have at least 10 digits."
    ),
});

type ProfileForm = z.infer<typeof profileSchema>;

//Main Component
export default function Profile() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      //studentId: "",
      phone: "",
    },
  });

  const watchedValues = watch();
  const isFormFilled = Object.values(watchedValues).every(
    (v) => String(v).length > 0
  );

  // Load Saved Data
  useEffect(() => {
    const loadProfile = async () => {
      const saved = await storage.get<ProfileForm>(storage.STORAGE_KEY.PROFILE);
      if (saved) {
        reset(saved);
        setHasSavedData(true);
      } else {
        setIsEditing(true);
      }

      const savedPhoto = await storage.get<string>(
        storage.STORAGE_KEY.PROFILE_PHOTO
      );
      if (savedPhoto) setPhotoUri(savedPhoto);

      setIsLoading(false);
    };

    loadProfile();
  }, []);

  // Profile Photo Picker
  const handlePhotoPress = () => {
    Alert.alert("Profile Photo", "Choose a source", [
      { text: "Take Photo", onPress: () => openPicker("camera") },
      { text: "Choose from Library", onPress: () => openPicker("library") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const openPicker = async (source: "camera" | "library") => {
    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.status !== "granted") {
      Alert.alert("Permission Denied", "Please enable permissions in settings.");
      return;
    }

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [1, 1],
            quality: 0.8,
          });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);
      await storage.set(storage.STORAGE_KEY.PROFILE_PHOTO, uri);
    }
  };

  // Save Profile
  const onSubmit = async (data: ProfileForm) => {
    try{
      
      await storage.set(storage.STORAGE_KEY.PROFILE, data);
      setHasSavedData(true);
      setIsEditing(false);
      Alert.alert(
        "Success",
        "Your profile has been saved successfully!",
      );
    }
    catch(error){
      Alert.alert("Error", "Failed to save profile data");
      console.error(error);
    }

  };

  const handleCancel = async () => {
    const saved = await storage.get<ProfileForm>(storage.STORAGE_KEY.PROFILE);
    if (saved) reset(saved);
    setIsEditing(false);
  };

  // Avatar Section
  const renderAvatar = () => (
    <View style={styles.avatarSection}>
      <Pressable onPress={handlePhotoPress} style={styles.avatarContainer}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="camera" size={20} color={COLORS.white} />
          </View>
        )}
        <Text style={styles.photoHint}>
          {photoUri ? "Tap to Change Photo" : "Add a Profile Photo"}
        </Text>
      </Pressable>
    </View>
  );

  // Loading State
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  //  View Profile
  if (!isEditing) {
    const values = watch();
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.replace("(tabs)/settings")}  style={{marginRight:15}}>
        <Ionicons name ="arrow-back" size={28} color={COLORS.primaryDark} />
      </Pressable>
        <Text style={styles.h1}>My Profile</Text>
        {renderAvatar()}

        {Object.entries(values).map(([label, value]) => (
          <View key={label} style={styles.profileCard}>
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>{label}</Text>
              <Text style={styles.profileValue}>{String(value)}</Text>
            </View>
            <View style={styles.divider} />
          </View>
        ))}

        <Pressable style={styles.button} onPress={() => setIsEditing(true)}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </Pressable>
      </ScrollView>
    );
  }

  // Edit Profile
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      <Pressable onPress={() => router.replace("(tabs)/settings")} style={{marginRight:15}}>
        <Ionicons name ="arrow-back" size={28} color={COLORS.primaryDark} />
      </Pressable>
      
      <Text style={styles.h1}>Edit Profile</Text>
      {renderAvatar()}

      {/* INPUT FIELDS */}
      {[
        { name: "firstName", label: "First Name", placeholder: "e.g John" },
        { name: "lastName", label: "Last Name", placeholder: "e.g Doe" },
        {
          name: "email",
          label: "Email",
          placeholder: "e.g example@example.com",
          keyboardType: "email-address" as KeyboardTypeOptions,
        },
        {
          name: "phone",
          label: "Phone Number",
          placeholder: "e.g (403) 555-0123",
          keyboardType: "phone-pad" as KeyboardTypeOptions,
        },
        
      ].map((field) => (
        <View key={field.name}>
          <Text style={styles.label}>{field.label}</Text>
          <Controller
            control={control}
            name={field.name as keyof ProfileForm}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  errors[field.name as keyof ProfileForm] && styles.inputError,
                ]}
                placeholder={field.placeholder}
                placeholderTextColor={COLORS.primaryDark + "80"}
                value={value}
                onChangeText={onChange}
                keyboardType={field.keyboardType}
                //maxLength={field.maxLength}
              />
            )}
          />
          {errors[field.name as keyof ProfileForm] && (
            <Text style={styles.error}>
              {errors[field.name as keyof ProfileForm]?.message}
            </Text>
          )}
        </View>
      ))}

      {/* BUTTONS */}
      {hasSavedData ? (
        <View style={styles.buttonRow}>
          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>

          <Pressable
            style={[styles.saveButton, !isFormFilled && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.buttonText}>Save Profile</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={[styles.button, !isFormFilled && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonText}>Save Profile</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SIZES.padding,
  },
  h1: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.primaryDark,
    marginBottom: 20,
  },

  
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primaryDark,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 14,
    fontSize: 16,
    color: COLORS.primaryDark,
    ...SHADOW,
  },
  inputError: {
    borderColor: "red",
  },
  error: {
    color: "red",
    fontSize: 13,
    marginTop: 4,
  },

  
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: 12,
    ...SHADOW,
  },
  profileRow: {
    padding: 16,
  },
  profileLabel: {
    fontSize: 13,
    color: COLORS.primaryDark + "80",
    marginBottom: 4,
  },
  profileValue: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primaryDark,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.card,
  },

  // Buttons
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginTop: 28,
    ...SHADOW,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: SIZES.radius,
    alignItems: "center",
    ...SHADOW,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.card,
    alignItems: "center",
  },
  cancelButtonText: {
    color: COLORS.primaryDark,
    fontSize: 16,
    fontWeight: "700",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 28,
  },
  buttonDisabled: {
    opacity: 0.5,
  },

  // Avatar
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOW,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: COLORS.card,
    ...SHADOW,
  },
  photoHint: {
    marginTop: 8,
    fontSize: 13,
    color: COLORS.primaryDark + "80",
  },
});



