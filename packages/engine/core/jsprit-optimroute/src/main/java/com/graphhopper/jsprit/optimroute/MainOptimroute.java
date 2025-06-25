/*
 * Licensed to GraphHopper GmbH under one or more contributor
 * license agreements. See the NOTICE file distributed with this work for
 * additional information regarding copyright ownership.
 *
 * GraphHopper GmbH licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.graphhopper.jsprit.optimroute;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import com.graphhopper.jsprit.core.problem.solution.VehicleRoutingProblemSolution;
import com.graphhopper.jsprit.optimroute.vrp.VrpAlgorithm;
import com.graphhopper.jsprit.optimroute.vrp.VrpException;
import com.graphhopper.jsprit.optimroute.vrp.VrpInput;
import com.graphhopper.jsprit.optimroute.vrp.VrpOutput;

import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class MainOptimroute {

    public static void main(String[] args) throws FileNotFoundException, IOException, ParseException, VrpException {

        boolean compileDeveloper = false; // put in true to debug with local input json

        try {
           VrpInput input;

            Arguments.init(args);

            if(!compileDeveloper) {
                
                String inJson = slurp(System.in);

                if (inJson.length() < 1) {
                return;
                }
    
                input = VrpInput.readAsjsonFrom(inJson);
    
                // Calculate bestSolution
    
                VrpAlgorithm vrpAlgorithm = new VrpAlgorithm();
    
                VehicleRoutingProblemSolution bestSolution = vrpAlgorithm.run(input);
    
                // Obtainning output formatted
    
                VrpOutput output = new VrpOutput().evaluateRoute(input, bestSolution);
    
                // print to output file
    
                String jsonOutput = output.printOutputToJson(input, output,
                Arguments.OuputFilePath);
    
                System.out.println(jsonOutput);
            
            } else {

                if (Arguments.InputFilePath.length() > 0) {

                    File inputFile = new File(Arguments.InputFilePath);
   
                    if (inputFile.exists()) {
   
                        // Obtainning input with deliveryPoints, options and vehicles
   
                        Object obj = new JSONParser().parse(new FileReader(inputFile));
   
                        input = VrpInput.readAsjsonFrom(obj.toString());
   
                        // Calculate bestSolution
   
                        VrpAlgorithm vrpAlgorithm = new VrpAlgorithm();
   
                        VehicleRoutingProblemSolution bestSolution = vrpAlgorithm.run(input);
   
                        // Obtainning output formatted
   
                        VrpOutput output = new VrpOutput().evaluateRoute(input, bestSolution);
   
                        // print to output file
   
                        String jsonOutput = output.printOutputToJson(input, output, Arguments.OuputFilePath);
   
                        System.out.println(jsonOutput);
   
                    }
   
                }
            }
 



        } catch (VrpException e) {
            System.err.println(e.getMessage());
        } catch (IllegalArgumentException e) {
            System.err.println(e.getMessage());
        }

    }

    public static String slurp(InputStream is) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(is));
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = br.readLine()) != null) {
            sb.append(line + "\n");
        }
        br.close();
        return sb.toString();
    }
}
