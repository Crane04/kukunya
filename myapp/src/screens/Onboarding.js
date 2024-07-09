// screens/OnboardingScreen.js
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

const OnboardingScreen = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = data => {
    console.log(data);
    // Here you can handle form submission, e.g., send data to backend
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Onboarding</Text>
      <Controller
        control={control}
        rules={{ required: 'First name is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="First Name"
          />
        )}
        name="first_name"
        defaultValue=""
      />
      {errors.first_name && <Text style={styles.error}>{errors.first_name.message}</Text>}

      <Controller
        control={control}
        rules={{ required: 'Last name is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Last Name"
          />
        )}
        name="last_name"
        defaultValue=""
      />
      {errors.last_name && <Text style={styles.error}>{errors.last_name.message}</Text>}

      <Controller
        control={control}
        rules={{ required: 'NIN is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="NIN"
          />
        )}
        name="NIN"
        defaultValue=""
      />
      {errors.NIN && <Text style={styles.error}>{errors.NIN.message}</Text>}

      <Controller
        control={control}
        rules={{ required: 'Email is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Email"
            keyboardType="email-address"
          />
        )}
        name="email"
        defaultValue=""
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        control={control}
        rules={{ required: 'Password is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Password"
            secureTextEntry
          />
        )}
        name="password"
        defaultValue=""
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
});

export default OnboardingScreen;
