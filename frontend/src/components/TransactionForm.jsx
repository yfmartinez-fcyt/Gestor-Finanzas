const handleChange = (event) => {
  const { name, value } = event.target;

  if (name === "tipo") {
    setForm((prev) => ({
      ...prev,
      tipo: value,
      categoria_id: "",
    }));
    return;
  }

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};