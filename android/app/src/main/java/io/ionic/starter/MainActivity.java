package io.ionic.starter;

import com.getcapacitor.BridgeActivity;
import io.capawesome.capacitorjs.plugins.firebase.messaging.FirebaseMessagingPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onStart() {
        super.onStart();
        registerPlugin(FirebaseMessagingPlugin.class);
    }
}
