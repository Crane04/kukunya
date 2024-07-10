import { useForm, Controller } from 'react-hook-form';
import { TextInput } from 'react-native';

const Input = () => {

    return (
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
    )
}