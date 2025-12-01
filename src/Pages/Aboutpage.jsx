import React from "react";
import Header from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function About (){
    return(
        <div className="min-h-screen bg-gray-50"> {/* Added min-h-screen and light background for contrast */}
            <Header/>
            
            {/* MAIN CONTENT CONTAINER: 
              - mx-auto centers the content on large screens.
              - lg:flex: Only use flex (side-by-side columns) on large screens (desktop).
              - flex-col: Stacks columns vertically on mobile first.
            */}
            <div className="flex flex-col lg:flex-row  mx-auto"> 
                
                {/* LEFT SIDE: 
                  - w-full: Takes full width on mobile/tablet.
                  - lg:w-1/2: Only takes half width on desktop.
                */}
                <div className="flex flex-col w-full lg:w-1/2"> 
                    
                    {/* Image 1 (Full width on all screens) */}
                    <img src="src\assets\Aboutpageimages\WhatsApp Image 2025-07-29 at 20.54.14_f416c0d6 2.png" alt="cec1" className="w-full object-cover"/>
                    
                    {/* Description 1 (OUR VISION) */}
                    {/* Padding adjusted for mobile (p-6) and desktop (px-8 py-14) */}
                    <div className="flex flex-col p-6 lg:px-8 lg:py-14 bg-red-900 mx-auto w-full"> 
                        <h1 className="font-bold text-4xl text-white mb-5 tracking-wide border-b-4 border-white inline-block w-fit">
                            OUR VISION
                        </h1>
                        <ol className="text-white text-lg leading-relaxed list-decimal list-inside space-y-4 pl-4 mb-5">
                            <li>
                                Safeguarding the rights of the people who are subjected to 
                                poverty, injustice and oppression.
                                <ul className="list-none pl-8 mt-1">
                                    <li>a. Appearing on behalf of economic processes based on   
                                        people oriented policies and supporting such alternative 
                                        processes.
                                    </li>
                                </ul>
                            </li>
                            <li>Promoting democratic good governance in state and other 
                                institutions at divisional, provincial and national levels.
                            </li>
                            <li>Encouraging women to become involved in social and 
                                economic development, making them realize their oppression 
                                and directing them to organize to gain their rights.
                            </li>
                            <li>Pressurizing those responsible and educating the people to 
                                promote a structure based on a people-friendly health policy.
                                <ul className="list-none pl-8 mt-1">
                                    <li>a. Promoting health practices and knowledge which include 
                                        the indigenous health system.
                                    </li>
                                </ul>
                            </li>
                            <li>Forming and organizing a group of youth and students who    
                                value humanness, who are intelligent and who will become 
                                opinion-makers.
                            </li>
                            <li>Educating, directing and activating people for conserving and 
                                nourishing the environment.
                            </li>
                        </ol>
                    </div>
                    
                    {/* Image 2 (Full width on all screens) */}
                    <img src="src\assets\Aboutpageimages\WhatsApp Image 2025-07-29 at 20.54.17_4263eb9d 1 (1).png" alt="Image2" className="w-full object-cover"/>
                </div>


                {/* RIGHT SIDE: 
                  - w-full: Takes full width on mobile/tablet.
                  - lg:w-1/2: Only takes half width on desktop.
                */}
                <div className="flex flex-col w-full lg:w-1/2">
                    
                    {/* Description 1 (OUR MISSION) */}
                    <div className="flex flex-col py-10 px-4 mb-10">
                        <h1 className="font-bold text-4xl text-red-900 mb-10">OUR MISSION</h1>
                        <p className="leading-7 text-gray-700">A Society in which, the democratic right of all are ensured, regardless of differences in race. creed, caste gender etc. the core values of society are respected and which is devoid of poverty, injustice and repression and which ensures the preservation of the environment including all living beings</p>
                    </div>
                    
                    {/* Image 3 */}
                    <img src="src\assets\Aboutpageimages\WhatsApp Image 2025-07-29 at 20.54.16_4784b34c 1.png" alt="Image2" className="w-full object-cover"/>
                    
                    {/* Description 2 (OUR OVERALL PHILOSOPHY) */}
                    <div className="flex flex-col px-6 py-14 mx-auto w-full">
                        <h1 className="font-bold text-4xl text-red-900 mb-5 tracking-wide border-b-4 border-red-900 inline-block w-fit">
                            OUR OVERALL PHILOSOPHY
                        </h1>
                        <ol className="list-decimal list-inside space-y-5 text-xl leading-relaxed py-9 text-gray-700">
                            <li>We believe in the equal dignity of all human beings.</li>
                            <li>We believe that people should be able to lead healthy, contented, fulfilled lives, as far as possible.</li>
                            <li>We realize that the present world structures, completely 
                                controlled by profit motives, make the lives of the majority 
                                miserable, forcing them to live subhuman lives.
                            </li>
                            <li>We believe that these structures can and should be changed.</li>
                            <li>We believe that both oppressed and other concerned groups 
                                can and should be motivated to work for desired change.
                            </li>
                            <li>We believe that sustaining the hope for a better world for our 
                                children, provides deep motivation to work out plans for 
                                change.
                            </li>
                            <li>Since every person is a social being, social development is as 
                                important as individual development and the sustained 
                                balance between the two aspects is necessary.
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
            
            {/* MIDDLE DESCRIPTION (History) - This section now spans the full page width */}
            <div className="flex flex-col py-10 px-4 bg-red-900">
                <p className="leading-10 text-lg text-white">The Community Education Centre (CEC) began in the mid-1970s as a small group of committed individuals responding to the suffering and injustices faced by marginalized communities in Sri Lanka. From 1976–1978, they traveled across the country, engaging with grassroots organizations, conducting leadership training, and offering alternative health education. In the following years, CEC expanded its focus to include alternative pre-schools, health worker training, and deepened its political awareness through partnerships with farmers, workers, and women. The 1980s saw CEC responding to the racial violence of Black July and forming new farmer and women's associations. Despite facing death threats during the violent political climate of the late 1980s, the Centre stood firmly for peace, justice, and nonviolence.
                    During the 1990s, CEC’s reach expanded significantly. It played an active role in the Free and Fair Elections campaign, contributed to the National Poverty Alleviation Program, and participated in global movements such as the Beijing Women's Conference. The Centre’s community-based programs particularly in education, health, and women's empowerment flourished across five districts. However, the political disappointments and funding cuts after 1996 led to a reduction in certain activities, especially children's programs. Nevertheless, the spirit of resilience remained strong. From 1999 to 2002, CEC revitalized its presence by reorganizing local networks and strengthening its governance and health programs. It promoted leadership, good governance, and community health under the theme of an "Alternative People’s Health Policy."
                </p>
            </div>
            
            {/* BOTTOM PARTNERS SECTION: 
              - flex-col: Stacks on mobile/tablet.
              - lg:flex-row: Side-by-side on desktop.
            */}
            <div className="flex flex-col lg:flex-row mx-auto w-full">
                
                {/* Left side bottom img */}
                <div className="flex flex-col w-full lg:w-1/2">
                    <img src="src\assets\Aboutpageimages\WhatsApp Image 2025-07-29 at 20.54.15_c3a8b30c 1 (1).png" alt="image3" className="w-full object-cover"/>
                </div>
                
                {/* Right side bottom description (Partners list) */}
                <div className="flex flex-col w-full lg:w-1/2 p-6">
                    <p className="text-xl mb-6 leading-relaxed text-gray-700">
                        Today, CEC works in partnership with nine legally recognized regional organizations, each with its own base of operations:
                    </p>
                    <ol className="list-decimal list-inside text-lg space-y-2 mb-0 pl-4 text-gray-700">
                        <li>Uwa Wellassa Farmer Women's Organisation – Monaragala</li>
                        <li>Community Resource Protection Centre – Monaragala</li>
                        <li>Human Resource Development Youth Guild – Hambantota</li>
                        <li>Ruhunu Community Development Centre – Kosgoda</li>
                        <li>Dambulla Community Resource Development Centre – Matale</li>
                        <li>Youth Resources Development Guild – Matale</li>
                        <li>Rajarata Janaprobodhini Foundation – Kakirawa</li>
                        <li>Vanni Community Development Foundation – Thanthirimale</li>
                        <li>Eastern United Women’s Organization – Kantale</li>
                    </ol>
                    <p className="text-xl mb-4 leading-relaxed mt-6 text-gray-700">
                        The national centre continues to coordinate and support these partners through four core sections:
                    </p>
                    <ul className="list-none text-xl font-medium space-y-2 mb-8 pl-4 text-gray-700">
                        <li>Training</li>
                        <li>Information and Documentation</li>
                        <li>Networking</li>
                        <li>Field Activities</li>
                    </ul>
                    <p className="text-lg leading-relaxed italic text-gray-700">
                        This structure ensures CEC’s long-standing commitment to justice, equity, and grassroots empowerment continues into the new millennium.
                    </p>
                </div>
            </div>
            
            <Footer/>
        </div>
    )
}