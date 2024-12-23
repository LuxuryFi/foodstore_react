import axiosClient from "../axios.config";

const userAPI = {
  signIn(email, password) {
    const url = `/auth/login`;
    return axiosClient.post(url, {
      email,
      password,
    });
  },
  signUp(newPatient) {
    const url = `/users/user`;
    return axiosClient.post(url, newPatient);
  },
  getOne(id) {
    const url = `/users/user/${id}`;
    return axiosClient.get(url);
  },
  verify(code) {
    const url = `/patient/verify`;
    return axiosClient.post(url, code);
  },
  resendCode() {
    const url = `/patient/resend`;
    return axiosClient.get(url);
  },
  update(newInformation, id) {
    console.log('newIn', newInformation)
    const url = `/users/user/${id}`;
    return axiosClient.put(url, newInformation, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  changePassword({password, id}) {
    const url = `/users/password/${id}`;
    return axiosClient.put(url, {
      password,
      id,
    });
  },
};

export default userAPI;
