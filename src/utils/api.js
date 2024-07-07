// export const BASE_URL = 'http://localhost:1337/api';
export const BASE_URL = 'https://planner.rdclr.ru/api';

const getResponseData = (res) => {
  if (!res.ok) {
    return Promise.reject(`Ошибка: ${res.status}`);
  }
  return res.json();
};

export const register = async (username, email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/local/register`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });
    return await getResponseData(response);
  } catch (error) {
    console.error(`Ошибка регистрации: ${error}`);
    throw error;
  }
};

export const authorize = async (identifier, password) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/local`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    });
    return await getResponseData(response);
  } catch (error) {
    console.error(`Ошибка авторизации: ${error}`);
    throw error;
  }
};

export const getContent = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return await getResponseData(response);
  } catch (error) {
    console.error(`Ошибка получения контента: ${error}`);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await fetch(`${BASE_URL}/signout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await getResponseData(response);
  } catch (error) {
    console.error(`Ошибка выхода: ${error}`);
    throw error;
  }
};

export const addEvent = async (title, description, location, dateStart, dateEnd, time, files) => {
  const token = localStorage.getItem('jwt');
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('location', location);
  formData.append('dateStart', dateStart);
  formData.append('dateEnd', dateEnd);
  formData.append('time', time);

  files.forEach((file) => formData.append('files', file));

  try {
    const response = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return await getResponseData(response);
  } catch (error) {
    console.error(`Ошибка добавления события: ${error}`);
    throw error;
  }
};

export const checkEmail = async (email) => {
  try {
    const response = await fetch(`${BASE_URL}/taken-emails/${email}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    console.error(`Ошибка проверки email: ${error}`);
    throw error;
  }
};

export const getEvents = async () => {
  try {
    // const response = await fetch(`${BASE_URL}/events`);
    const response = await fetch(
      `${BASE_URL}/events/?pagination%5BpageSize%5D=999&populate=participants%2C%20owner`,
    );
    if (!response.ok) {
      throw new Error('Ошибка получения событий');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Ошибка получения событий: ${error}`);
    throw error;
  }
};

export const joinEvent = async (eventId) => {
  const token = localStorage.getItem('jwt');
  try {
    const response = await fetch(`${BASE_URL}/events/${eventId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return await getResponseData(response);
  } catch (error) {
    console.error(`Ошибка присоединения к событию: ${error}`);
    throw error;
  }
};

export const outEvent = async (eventId) => {
  const token = localStorage.getItem('jwt');
  try {
    const response = await fetch(`${BASE_URL}/events/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return await getResponseData(response);
  } catch (error) {
    console.error(`Ошибка отмены участия в событии: ${error}`);
    throw error;
  }
};
