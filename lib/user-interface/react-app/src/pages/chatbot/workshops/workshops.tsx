// src/pages/chatbot/workshops/workshops.tsx
import { useState } from "react";
import BaseAppLayout from "../../../components/base-app-layout";
import { Header, ContentLayout, SpaceBetween, BreadcrumbGroup } from "@cloudscape-design/components";

// Define the WorkshopSection component
const WorkshopSection = ({ id, title, description }: { id: string; title: string; description: string }) => (
  <section id={id} style={{ marginBottom: '2rem' }}>
    <Header variant="h2">{title}</Header>
    <div dangerouslySetInnerHTML={{ __html: description }} />
  </section>
);

export default function Workshops() {
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <BaseAppLayout
      toolsOpen={toolsOpen}
      onToolsChange={(e) => setToolsOpen(e.detail.open)}
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            {
              text: "Home",
              href: "/",
            },
            {
              text: "Workshops",
              href: "/chatbot/workshops",
            },
          ]}
        />
      }
      content={
        <ContentLayout
          header={<Header variant="h1">Security Workshops</Header>}
        >
          <nav style={{ marginBottom: '2rem' }}>
            <SpaceBetween size="l">
              <a href="#cloud-security">Cloud Security, Risk and Compliance workshop</a>
              <a href="#auditing-aws">Auditing AWS Cloud (Audit Security In the Cloud) - An Auditor's Lens</a>
              <a href="#threat-management">Threat Management</a>
              <a href="#genai-security">GenAI & Security</a>
              <a href="#threat-modeling">Threat Modeling workshop</a>
            </SpaceBetween>
          </nav>

          <WorkshopSection
            id="cloud-security"
            title="Cloud Security, Risk and Compliance Workshop"
            description={`<strong>Cloud Security Key Concepts:</strong> Covering new constructs in cloud & security. What does a good security posture look like and how can it be operationalized?
              <ul>
                <li><strong>Building Visibility & Cloud Governance:</strong> At scale.</li>
                <li><strong>Modern Cloud SRC Capabilities:</strong> Reduce risks and costs.</li>
                <li><strong>Zero Trust Security:</strong> Building & executing in AWS Cloud.</li>
                <li><strong>Cloud-Native Threat Detection and Response:</strong> Protect, Detect, and Respond; Log management, analysis, and incident response (IR) playbooks.</li>
                <li><strong>Self & Regulatory Audit Preparedness:</strong> Audit methodologies and internal preparation; Strategies to accelerate the audit process.</li>
                <li><strong>Security Strategy for GenAI Adoption:</strong> Building a secure roadmap & facilitating GenAI-enabled applications.</li>
              </ul>`}
          />

          <WorkshopSection
            id="auditing-aws"
            title="Auditing AWS Cloud (Audit Security In the Cloud) - An Auditor's Lens"
            description={`<strong>Track 1: Regulated Workload - Apply Auditor's Lens:</strong> Auditing AWS cloud is essential for the regulated industry to ensure the protection of sensitive data & systems.
              <ul>
                <li><strong>Data Protection & Localization Controls:</strong> Assess effectiveness and compliance.</li>
                <li><strong>Cloud Configuration & Access Management:</strong> Key concepts and tools.</li>
                <li><strong>Monitoring & Logging:</strong> From an audit & forensic lens.</li>
                <li><strong>Vulnerability & Threat Management:</strong> Best practices and controls.</li>
                <li><strong>Incident Response:</strong> Techniques and strategies.</li>
              </ul>
              Key Services to promote: Control Tower, Security Hub, Audit Manager.`}
          />

          <WorkshopSection
            id="threat-management"
            title="Threat Management"
            description={`<strong>Track 2: Threat Management:</strong> Workshop includes architecture patterns for Cloud SOC.
              <ul>
                <li><strong>SOC Components:</strong> Analyzing log lines ingestion, parsing methods, and analytics.</li>
                <li><strong>Cloud SOC Operations:</strong> Differences from traditional SOC environments.</li>
                <li><strong>Attack Patterns & Playbooks:</strong> Building a Cloud SOC playbook and analyzing threats.</li>
                <li><strong>Customer Success Stories:</strong> Case study of a ground-up SOC built project.</li>
              </ul>
              Key Service to promote: Amazon Security Lake & OpenSearch.`}
          />

          <WorkshopSection
            id="genai-security"
            title="GenAI & Security"
            description={`<strong>Track 3: GenAI and Security:</strong> Designed for cybersecurity leadership.
              <ul>
                <li><strong>Security of Generative AI:</strong> Securing business applications leveraging Generative AI.</li>
                <li><strong>Generative AI for Security:</strong> Using Generative AI to minimize vulnerabilities, threats & risks.</li>
                <li><strong>Security from Generative AI-Powered Threats:</strong> Protecting against threat actors using Generative AI.</li>
              </ul>
              Key Services to promote: Macie, Amazon Security Lake, OpenSearch & Vector DB.`}
          />

          <WorkshopSection
            id="threat-modeling"
            title="Threat Modeling Workshop for Advanced Customers"
            description={`<strong>Track 4: Threat Modeling Workshop (4-5 hours):</strong> A comprehensive approach designed to enhance an organization's cloud security posture.
              <ul>
                <li><strong>Threat Modeling Report:</strong> A detailed report outlining identified threat scenarios, their potential impact, and prioritized recommendations.</li>
                <li><strong>Risk Management Roadmap:</strong> A tailored roadmap to guide your organization in implementing recommended risk management strategies.</li>
                <li><strong>Enhanced Security Awareness:</strong> Increased awareness of potential threats and their impact.</li>
              </ul>
              <strong>Prerequisites from the Customer:</strong>
              <ul>
                <li>Share CSPM and KSPM assessment report or similar within the last 12 months.</li>
                <li>Availability of key stakeholders for participation.</li>
                <li>Willingness to share relevant architectural diagrams and security configurations.</li>
                <li>Defined organizational risk appetite and tolerance levels.</li>
                <li>CloudOps and SecOps decision-making team involvement.</li>
              </ul>`}
          />
        </ContentLayout>
      }
    />
  );
}
