const role = {
  Student: 'Student',
  Instructor: 'Instructor',
};

const isValidRole = (userRole) => {
  if (!userRole) return false;
  return userRole.toUpperCase() === role.Student.toUpperCase() ||
  userRole.toUpperCase() === role.Instructor.toUpperCase();
};

module.exports = {
    ...role,
    isValidRole
}
