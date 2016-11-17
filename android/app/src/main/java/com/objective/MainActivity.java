package com.exease.etd.objective;

import android.content.Intent;

import com.facebook.react.ReactActivity;
import com.umeng.analytics.MobclickAgent;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "objective";
    }

    @Override
    protected void onResume() {
        super.onResume();
        MobclickAgent.onResume(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        MobclickAgent.onPause(this);
    }

    @Override
      public void invokeDefaultOnBackPressed() {
          Intent setIntent = new Intent(Intent.ACTION_MAIN);
          setIntent.addCategory(Intent.CATEGORY_HOME);
          setIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
          startActivity(setIntent);
      }
}
