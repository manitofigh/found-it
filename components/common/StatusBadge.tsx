import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../constants/Colors';

type StatusType = 'lost' | 'found' | 'claimed';

interface StatusBadgeProps {
    status: StatusType;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const getStatusColor = () => Colors.status[status];

    return (
        <View 
            className="px-2 py-1 rounded-full" 
            style={{ backgroundColor: getStatusColor() }}
        >
            <Text className="text-white text-xs font-medium capitalize">
                {status}
            </Text>
        </View>
    );
}
