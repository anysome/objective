package com.exease.etd.objective;

import com.facebook.react.ReactActivity;
import com.zyu.ReactNativeWheelPickerPackage;
import cn.reactnative.modules.weibo.WeiboPackage;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.umeng.analytics.MobclickAgent;

import in.esseak.react_native_umeng.UmengPackage;
import co.fixt.wheel.WheelPackage;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "objective";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new ReactNativeWheelPickerPackage(),
            new WeiboPackage(),
            new ImagePickerPackage(),
            new VectorIconsPackage(),
            new ReactNativeI18n(),
            new RNDeviceInfo(),
            new UmengPackage(),
            new WheelPackage()
        );
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
}
