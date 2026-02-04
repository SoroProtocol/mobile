import { Tabs }       from 'expo-router';
import { Ionicons }   from '@expo/vector-icons';
import { Colors }     from '@/constants/Colors';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface Tab { name: string; title: string; icon: IconName; activeIcon: IconName; }

const TABS: Tab[] = [
  { name: 'index',    title: 'Streams',  icon: 'water-outline',   activeIcon: 'water'   },
  { name: 'create',   title: 'New',      icon: 'add-circle-outline', activeIcon: 'add-circle' },
  { name: 'vesting',  title: 'Vesting',  icon: 'calendar-outline', activeIcon: 'calendar' },
  { name: 'settings', title: 'Settings', icon: 'settings-outline', activeIcon: 'settings' },
];

const T = Colors.dark;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor:   T.accent,
        tabBarInactiveTintColor: T.textMuted,
        tabBarStyle: {
          backgroundColor: T.surface,
          borderTopColor:  T.border,
          borderTopWidth:  1,
        },
        headerStyle:     { backgroundColor: T.surface },
        headerTintColor: T.text,
        headerShadowVisible: false,
      }}
    >
      {TABS.map(t => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{
            title:    t.title,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? t.activeIcon : t.icon}
                size={size}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
