# The Resume Project

1. Build four JSONs, each one representing a different resume section.
 * `work` contains an array of `jobs`. Each `job` object in `jobs` should contain an `employer`, `title`, `location`, `dates worked` and `description`.
 * `projects` contains an array of `projects`. Each `project` object in `projects` should contain a `title`, `dates worked`, `description`, and an `images` array with URL strings for project images.
 * `bio` contains a `name`, `role`, `welcomeMessage`, `contacts` object and `skills` array. The `contacts` object contains a `mobile number`, `email` address, `github` username, and `location`.
 * `education` contains an array of `schools`. Each `school` object in `schools` contains a `name`, `location`, `degree`, `majors` array, `dates attended` and a `url` for the school's website. `education` also contains an `onlineCourses` array. Each `onlineCourse` object in `onlineCourses` should contain a `title`, `school`, `dates attended` and a `url` for the course.
2. Iterate through each JSON and append its information to index.html in the correct section.
 * Use jQuery’s `selector.append()` and `selector.prepend()` functions to modify index.html. `selector.append()` makes an element appear at the end of a selected section. `selector.prepend()` makes an element appear at the beginning of a selected section.
* Use the JavaScript method `string.replace(old, new)` to swap out all the placeholder text (e.g. `%data%`) for data from resume JSONs.
3. The resume includes an interactive map.
4. All of the code for adding elements to the resume is within functions. And all functions are encapsulated within the same objects containing the resume data.
