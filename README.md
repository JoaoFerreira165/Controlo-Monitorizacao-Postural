# Controlo de Monitorização Postural
The "Postural Control Monitoring" application is a powerful tool designed for comprehensive posture analysis and monitoring. It consists of three main pages, each serving a crucial role in the assessment and management of patients' postural data.

***Key Features:*** 

  **Patient Information Page:**

  This page provides a detailed overview of patient profiles, including personal data, medical history, and assigned tasks.
  Users can easily access and manage patient information, ensuring a well-organized record of each individual under care.
    

  **Real-time Visualization Page:**

  Here, users can observe real-time postural data displayed in sagittal, transverse, and frontal planes.
  The interface allows for the selection of a specific patient and task, providing dynamic insights into their posture during task execution.

  **Session Log Page:**
  
  The session log maintains a comprehensive record of all conducted sessions.
  Users can select a session from the log and access detailed data, including line charts and scatter plots for sagittal, transverse, and frontal planes.
  Additionally, the page offers statistical data to aid in postural analysis.
  Users have the flexibility to export session data to CSV and generate detailed reports in PDF format, providing a valuable resource for in-depth analysis and documentation.

Currently **under development.**

Real-time visualization of a session where a patient performs a specific task, allowing for the analysis of the sagittal, transverse, and frontal planes of the patient through line charts and axis scatter plots.

![RealTimeVisualizationOfASession](./other/Imagem3.png)

Visualization of a past session

![VisualizationPastsession](./other/Imagem4.png)

Table of conducted sessions for different patients, with the ability to export saved data from each session (in CSV format) as well as reports with associated graphs and statistical data (in PDF format).

![VisualizationExport](./other/Imagem5.png)



cd Controlo-Monitorizacao-Postural

npm install         (install libraries)

npm start           (in cmd) 

npm run devicesimulator    (in new cmd, needs to both running at same time)
