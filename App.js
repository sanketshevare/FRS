import tw from "twrnc";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import ResetPassword from "./screens/ResetPassword";
import Home from "./components/Home";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={SignIn} options={{headerShown: false}}/>
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />

        <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>

        {/* <Stack.Screen name="Notifications" component={Notifications} />
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="Settings" component={Settings} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
