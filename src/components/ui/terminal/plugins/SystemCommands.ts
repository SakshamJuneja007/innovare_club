import { CommandPlugin, TerminalCommand } from "../TerminalPlugin";

export const helpCommand: CommandPlugin = {
  name: "help",
  description: "Lists all available commands",
  async execute(args: string[]): Promise<TerminalCommand> {
    const timestamp = new Date().toLocaleTimeString();
    return {
      input: "help",
      output: "Available commands:\n" +
             "help     - Shows this help message\n" +
             "clear    - Clears the terminal\n" +
             "system   - Shows system information\n" +
             "theme    - Changes terminal theme (light/dark)\n" +
             "font     - Changes font size (12-20)\n" +
             "toggle   - Shows/hides the terminal\n" +
             "matrix   - Displays matrix animation\n" +
             "stats    - Shows current system stats\n" +
             "info     - Shows club information and contacts",
      timestamp,
      type: "info"
    };
  }
};

export const aboutCommand: CommandPlugin = {
  name: "about",
  description: "Learn about our organization (interactive)",
  async execute(args: string[]): Promise<TerminalCommand> {
    const timestamp = new Date().toLocaleTimeString();
    
    if (!args.length) {
      return {
        input: "about",
        output: `Welcome to Innovare Technical Club!

Select a category to learn more:
1. team - Meet our leadership team
2. contact - Connect with us
3. vision - Our mission and values
4. projects - Current initiatives
5. achievements - Our milestones
6. events - Upcoming activities
7. join - How to become a member

Usage: about <category>`,
        timestamp,
        type: "info"
      };
    }

    const category = args[0].toLowerCase();
    
    switch (category) {
      case "team":
        return {
          input: `about ${category}`,
          output: `Leadership Team:

1. Dr. James Anderson
   Role: Faculty Mentor
   Expertise: AI/ML, Systems Architecture, Research
   Experience: 15+ years
   Publications: 12
   Projects Led: 25+

2. Sarah Chen
   Role: Technical Coordinator
   Expertise: Project Management, Full Stack Development
   Projects Led: 30+
   Team Size: 50+ members
   Industry Partners: 15+

3. Michael Torres
   Role: Events Coordinator
   Expertise: Event Planning, Community Management
   Events Organized: 100+
   Workshops Conducted: 50+
   Community Size: 300+ members`,
          timestamp,
          type: "success"
        };

      case "contact":
        return {
          input: `about ${category}`,
          output: `Contact Information:

📧 Email: contact@innovare.tech
🌐 Website: www.innovare.tech
📱 Phone: +1 (555) 123-4567

Social Media:
• Discord: innovare.discord.com
• GitHub: github.com/innovare
• LinkedIn: linkedin.com/company/innovare
• Twitter: @innovaretech

Office Location:
Innovation Hub, Tech Valley
123 Digital Drive
Silicon City, SC 12345`,
          timestamp,
          type: "success"
        };

      case "vision":
        return {
          input: `about ${category}`,
          output: `Our Vision & Mission:

Vision:
To be at the forefront of technological innovation, creating solutions that make 
a meaningful impact on society while nurturing the next generation of tech 
leaders through hands-on experience and mentorship.

Mission:
We are a pioneering technical organization dedicated to fostering innovation, 
collaboration, and technological advancement. Our mission is to create an 
environment where creativity meets technical excellence, empowering the next 
generation of technology leaders.

Core Values:
• Innovation First
• Collaborative Learning
• Technical Excellence
• Ethical Development
• Community Impact

Goals:
• Foster technological innovation
• Provide hands-on learning experiences
• Build industry partnerships
• Create real-world solutions
• Develop future tech leaders`,
          timestamp,
          type: "success"
        };

      case "about":
        return {
          input: `about ${category}`,
          output: `About Innovare Technical Club:

Established: 2020
Members: 300+
Projects Completed: 50+
Annual Events: 24+

We are a dynamic community of tech enthusiasts, innovators, and problem-solvers 
dedicated to pushing the boundaries of technology. Our club brings together 
students, professionals, and industry experts to create an ecosystem of 
learning and innovation.

Key Focus Areas:
• Artificial Intelligence & Machine Learning
• Cloud Computing & DevOps
• Cybersecurity & Network Infrastructure
• Robotics & Automation
• Full Stack Development
• UI/UX Design

Achievements:
• Best Tech Club Award 2024
• 15+ Industry Partnerships
• 100+ Successful Workshops
• 25+ Research Publications
• 30+ Hackathon Wins`,
          timestamp,
          type: "success"
        };

      default:
        return {
          input: `about ${category}`,
          output: "Invalid category. Use: about <team|contact|vision|about>",
          timestamp,
          type: "error"
        };
    }
  }
};

export const systemCommand: CommandPlugin = {
  name: "system",
  description: "Displays system information",
  async execute(args: string[]): Promise<TerminalCommand> {
    const timestamp = new Date().toLocaleTimeString();
    return {
      input: "system",
      output: `INNOVARE TECHNICAL CLUB - SYSTEM INFORMATION

Mission:
We are a pioneering technical organization dedicated to fostering innovation, collaboration, and technological advancement. Our mission is to create an environment where creativity meets technical excellence, empowering the next generation of technology leaders.

Vision:
To be at the forefront of technological innovation, creating solutions that make a meaningful impact on society while nurturing the next generation of tech leaders through hands-on experience and mentorship.

Statistics:
• Active Members: 300+
• Projects Completed: 50+
• Annual Events: 24+
• Technical Teams: 8+
• Research Groups: 5+
• Industry Partners: 15+

Leadership Team:
1. Dr. James Anderson
   Role: Faculty Mentor
   Expertise: AI/ML, Systems Architecture, Research
   Experience: 15+ years

2. Sarah Chen
   Role: Technical Coordinator
   Expertise: Project Management, Full Stack, DevOps
   Projects Led: 25+

3. Michael Torres
   Role: Events Coordinator
   Expertise: Event Planning, Community Management
   Events Organized: 100+

Core Focus Areas:
• Artificial Intelligence & Machine Learning
• Cloud Computing & DevOps
• Cybersecurity & Network Infrastructure
• Robotics & Automation
• Full Stack Development
• UI/UX Design

Status: All Systems Operational
Network: Connected (1000Mbps)
Location: Secured`,
      timestamp,
      type: "success"
    };
  }
};

export const teamCommand: CommandPlugin = {
  name: "team",
  description: "Shows information about our leadership team",
  async execute(args: string[]): Promise<TerminalCommand> {
    const timestamp = new Date().toLocaleTimeString();
    return {
      input: "team",
      output: `Leadership Team:

1. Dr. James Anderson
   Role: Faculty Mentor
   Expertise: AI/ML, Systems Architecture, Research
   Experience: 15+ years
   Publications: 12
   Projects Led: 25+

2. Sarah Chen
   Role: Technical Coordinator
   Expertise: Project Management, Full Stack Development
   Projects Led: 30+
   Team Size: 50+ members
   Industry Partners: 15+

3. Michael Torres
   Role: Events Coordinator
   Expertise: Event Planning, Community Management
   Events Organized: 100+
   Workshops Conducted: 50+
   Community Size: 300+ members`,
      timestamp,
      type: "info"
    };
  }
};

export const connectCommand: CommandPlugin = {
  name: "connect",
  description: "Shows ways to connect with our community",
  async execute(args: string[]): Promise<TerminalCommand> {
    const timestamp = new Date().toLocaleTimeString();
    return {
      input: "connect",
      output: `Connect With Us:

Technical Workshops:
• Weekly coding sessions
• Industry expert talks
• Hands-on project experience
• Advanced technology workshops
• Certification programs

Networking Events:
• Tech meetups
• Industry connections
• Career opportunities
• Mentorship programs
• Hackathons

Communication Channels:
• Discord Server: innovare.discord.com
• GitHub: github.com/innovare
• LinkedIn: linkedin.com/company/innovare
• Twitter: @innovaretech
• Email: connect@innovare.tech`,
      timestamp,
      type: "info"
    };
  }
};

export const joinCommand: CommandPlugin = {
  name: "join",
  description: "Information about joining our community",
  async execute(args: string[]): Promise<TerminalCommand> {
    const timestamp = new Date().toLocaleTimeString();
    return {
      input: "join",
      output: `Join Innovare Technical Club:

Available Roles:
1. Technical Teams
   • Software Development
   • AI/ML Research
   • Cloud Infrastructure
   • Cybersecurity

2. Research Groups
   • Quantum Computing
   • Robotics & Automation
   • Blockchain Technology
   • Green Computing

3. Leadership Roles
   • Project Leads
   • Team Coordinators
   • Workshop Facilitators
   • Community Managers

Requirements:
• Strong passion for technology
• Commitment to learning
• Team collaboration skills
• Min. 5 hours/week commitment

Benefits:
• Hands-on project experience
• Industry mentorship
• Networking opportunities
• Professional development
• Access to resources & tools

Apply at: join.innovare.tech`,
      timestamp,
      type: "info"
    };
  }
};

export const infoCommand: CommandPlugin = {
  name: "info",
  description: "Shows club information and contacts",
  async execute(args: string[]): Promise<TerminalCommand> {
    const timestamp = new Date().toLocaleTimeString();
    return {
      input: "info",
      output: `
INNOVARE TECHNICAL CLUB - INFORMATION CENTER

Vision:
To be at the forefront of technological innovation, creating solutions that make 
a meaningful impact on society while nurturing the next generation of tech 
leaders through hands-on experience and mentorship.

Mission:
We are a pioneering technical organization dedicated to fostering innovation, 
collaboration, and technological advancement. Our mission is to create an 
environment where creativity meets technical excellence, empowering the next 
generation of technology leaders.

Core Values:
• Innovation First
• Collaborative Learning
• Technical Excellence
• Ethical Development
• Community Impact

Club Coordinators:
1. Dr. James Anderson
   Role: Faculty Mentor
   Contact: james.anderson@innovare.tech
   Office Hours: Mon-Fri, 10:00-16:00
   Photo: https://images.unsplash.com/photo-1560250097-0b93528c311a

2. Sarah Chen
   Role: Technical Coordinator
   Contact: sarah.chen@innovare.tech
   Areas: Project Management, Development
   Photo: https://images.unsplash.com/photo-1573496359142-b8d87734a5a2

3. Michael Torres
   Role: Events Coordinator
   Contact: michael.torres@innovare.tech
   Areas: Community, Events
   Photo: https://images.unsplash.com/photo-1519085360753-af0119f7cbe7

Connect With Us:
• Email: contact@innovare.tech
• Discord: discord.innovare.tech
• GitHub: github.com/innovare
• LinkedIn: linkedin.com/company/innovare
• Twitter: @innovaretech

Office Location:
Innovation Hub, Tech Valley
123 Digital Drive
Silicon City, SC 12345

Join Us:
Visit join.innovare.tech to become a member
or type 'join' for more information.

Status: Active & Recruiting
`,
      timestamp,
      type: "success",
      effect: "showPhotos",
      photos: [
        {
          url: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
          name: "Dr. James Anderson",
          role: "Faculty Mentor"
        },
        {
          url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
          name: "Sarah Chen", 
          role: "Technical Coordinator"
        },
        {
          url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
          name: "Michael Torres",
          role: "Events Coordinator"
        }
      ]
    };
  }
};

export const statsCommand: CommandPlugin = {
  name: "stats",
  description: "Shows current system statistics",
  async execute(args: string[]): Promise<TerminalCommand> {
    const timestamp = new Date().toLocaleTimeString();
    const stats = {
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      network: Math.floor(Math.random() * 100),
      uptime: Math.floor(Math.random() * 24)
    };

    return {
      input: "stats",
      output: `System Statistics:
CPU Usage: ${stats.cpu}%
Memory Usage: ${stats.memory}%
Network Load: ${stats.network}%
Uptime: ${stats.uptime} hours
All systems operational`,
      timestamp,
      type: "info"
    };
  }
};
