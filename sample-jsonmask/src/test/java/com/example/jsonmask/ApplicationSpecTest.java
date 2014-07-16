package com.example.jsonmask;

import java.io.IOException;
import java.util.Collection;

import org.junit.Test;
import org.junit.runners.Parameterized.Parameters;

public class ApplicationSpecTest extends com.pivotal.mss.apigateway.test.ApplicationSpecTest {

	public ApplicationSpecTest(String specName, String specFile) {
        super(specName, specFile);
    }
	
	@Parameters(name = "{0}")
    public static Collection<Object[]> getParameters() throws IOException {
        return com.pivotal.mss.apigateway.test.ApplicationSpecTest.getParameters("spec");
    }

    @Test
    public void testSpecFiles() throws Exception {
        super.testSpecFiles();
    }
}
