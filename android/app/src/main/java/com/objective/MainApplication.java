package com.objective;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import in.esseak.react_native_umeng.UmengPackage;
import co.fixt.wheel.WheelPackage;
import com.zyu.ReactNativeWheelPickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import cn.reactnative.modules.weibo.WeiboPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new RNSpinkitPackage(),
          new MainReactPackage(),
          new UmengPackage(),
          new WheelPackage(),
          new ReactNativeWheelPickerPackage(),
          new VectorIconsPackage(),
          new RNSpinkitPackage(),
          new WeiboPackage(),
          new ReactNativeI18n()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
