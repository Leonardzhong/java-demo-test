package demo.core.dailylearn.util;


import lombok.SneakyThrows;
import org.apache.commons.lang3.StringUtils;

import java.lang.reflect.Constructor;
import java.util.Objects;

/**
 * @author leonard
 * @create 2023-04-09 15:20
 */
public class AssertUtil {

    private static String exceptionClassName;

    private static Constructor constructor;


    @SneakyThrows
    public static void isTrue(final boolean expValue, final CommonResultCode resultCode, final Object... objs) {

        if (!expValue) {

            CommonException exception = null;
            String logString = getLogString(objs);

            String resultMsg = StringUtils.isNotBlank(logString) ? logString : resultCode.getResultMsg();

            try {
                exception = (CommonException) constructor.newInstance(resultMsg);
            } catch (Throwable throwable) {

                throw new IllegalArgumentException("AssertUtil has not been initialized correctly! [exceptionClassName=" + exceptionClassName + ",resultCode=" + resultCode + ",resultMsg=" + resultMsg + "]", exception);
            }

            exception.setResultCode(resultCode);
            throw exception;
        }
    }

    private static String getLogString(Object[] objs) {

        StringBuilder log = new StringBuilder();

        for (Object o : objs) {
            log.append(o);
        }
        return log.toString();
    }

    public static void isFalse(final boolean expValue, final CommonResultCode resultCode, final Object... objs) {
        isTrue(!expValue, resultCode, objs);

    }

    public static void equals(final Object obj1, final Object obj2, final CommonResultCode resultCode, final Object... objs) {
        isTrue(Objects.equals(obj1, obj2), resultCode, objs);

    }

    public static void blank(final String str, final CommonResultCode resultCode, final Object... objs) {
        isTrue(StringUtils.isBlank(str), resultCode, objs);

    }

    public static void isNull(final Object object, final CommonResultCode resultCode, final Object... objs) {
        isTrue(object == null, resultCode, objs);

    }

    public static void nonNull(final Object object, final CommonResultCode resultCode, final Object... objs) {
        isTrue(object != null, resultCode, objs);

    }

    public static void initConfig() {

        Class exceptionClassTmp = null;

        if (StringUtils.isBlank(exceptionClassName)) {
            throw new IllegalArgumentException();
        }

        try {
            exceptionClassTmp = Class.forName(exceptionClassName);
        } catch (ClassNotFoundException e) {
            throw new IllegalArgumentException();
        }

        if (!CommonException.class.isAssignableFrom(exceptionClassTmp)) {
            throw new IllegalArgumentException();
        }

        Constructor constructorTmp = null;

        try {
            constructorTmp = exceptionClassTmp.getConstructor(String.class);
        } catch (NoSuchMethodException e) {
            throw new IllegalArgumentException();
        }
        constructor = constructorTmp;

    }

    public static String getExceptionClassName() {
        return exceptionClassName;
    }

    public static void setExceptionClassName(String exceptionClassName) {
        AssertUtil.exceptionClassName = exceptionClassName;
    }

    public static Constructor getConstructor() {
        return constructor;
    }

    public static void setConstructor(Constructor constructor) {
        AssertUtil.constructor = constructor;
    }
}
