package com.iTattoo.app;

import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Opt-in al edge-to-edge (Android 15+ y versiones anteriores)
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

        // Aplicar márgenes al WebView para status bar, nav bar, notch y teclado
        applyInsetsToWebView();
    }

    private void applyInsetsToWebView() {
        final View webView = getBridge().getWebView();
        if (webView == null) return;

        ViewCompat.setOnApplyWindowInsetsListener(webView, (v, insets) -> {
            // Tipos de insets que queremos manejar
            int types = WindowInsetsCompat.Type.statusBars()
                    | WindowInsetsCompat.Type.navigationBars()
                    | WindowInsetsCompat.Type.displayCutout()
                    | WindowInsetsCompat.Type.ime(); // teclado

            Insets bars = insets.getInsets(types);

            // Aplicar los márgenes al WebView
            ViewGroup.MarginLayoutParams lp = (ViewGroup.MarginLayoutParams) v.getLayoutParams();
            lp.topMargin = bars.top;         // preserva status bar
            lp.bottomMargin = bars.bottom;   // preserva nav bar y teclado
            lp.leftMargin = bars.left;
            lp.rightMargin = bars.right;
            v.setLayoutParams(lp);

            // Consumimos los insets para que no se propaguen a hijos
            return WindowInsetsCompat.CONSUMED;
        });
    }
}
