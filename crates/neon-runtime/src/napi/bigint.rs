use crate::napi::bindings as napi;
use crate::raw::{Env, Local};
use std::mem::MaybeUninit;

/// Create a new date object
///
/// # Safety
///
/// `env` is a raw pointer. Please ensure it points to a napi_env that is valid for the current context.
pub unsafe fn new_bigint(env: Env, value: i64) -> Local {
    let mut local = MaybeUninit::zeroed();
    let status = napi::create_bigint_int64(env, value, local.as_mut_ptr());
    assert_eq!(status, napi::Status::Ok);
    local.assume_init()
}

/// Get the value of a date object
///
/// # Safety
///
/// `env` is a raw pointer. Please ensure it points to a napi_env that is valid for the current context.
/// `Local` must be an NAPI value associated with the given `Env`
pub unsafe fn value_i64(env: Env, p: Local) -> i64 {
    let mut value: i64 = 0;
    let mut lossless = false;
    let status = napi::get_value_bigint_int64(env, p, &mut value as *mut _, &mut lossless as *mut _);
    assert_eq!(status, napi::Status::Ok);
    value
}
